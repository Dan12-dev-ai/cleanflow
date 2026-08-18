<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePaymentRequest;
use App\Http\Requests\VerifyPaymentRequest;
use App\Models\Order;
use App\Models\Payment;
use App\Notifications\PaymentStatusChanged;
use App\Services\Payments\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $payments) {}

    public function index(Request $request) { $query = Payment::with(['order', 'customer']); if ($request->user()->role === 'customer') $query->where('customer_id', $request->user()->id); return $query->latest()->paginate(); }

    /** Creates a pending, server-priced payment. The client cannot set amount or paid status. */
    public function create(CreatePaymentRequest $request)
    {
        $data = $request->validated();
        $order = Order::findOrFail($data['order_id']);
        abort_unless($request->user()->role !== 'customer' || $order->customer_id === $request->user()->id, 403);
        abort_if($order->payment_status === 'paid', 422, 'This order is already paid.');
        $payment = Payment::create(['order_id' => $order->id, 'customer_id' => $order->customer_id, 'amount' => $order->total_amount, 'currency' => 'ETB', 'payment_method' => $data['payment_method'], 'status' => 'pending', 'transaction_reference' => 'CF-'.Str::upper(Str::random(20))]);
        try { $checkout = $this->payments->create($payment); } catch (RuntimeException $exception) { $payment->update(['status' => 'failed', 'failure_reason' => $exception->getMessage()]); return response()->json(['message' => $exception->getMessage(), 'payment' => $payment], 422); }
        return response()->json(['payment' => $payment->fresh(), 'checkout' => $checkout], 201);
    }

    public function show(Request $request, Payment $payment) { abort_unless($request->user()->role !== 'customer' || $payment->customer_id === $request->user()->id, 403); return $payment->load(['order.items.service', 'customer']); }

    /** Staff/admin may manually confirm cash only. */
    public function confirmCash(Request $request, Payment $payment)
    {
        abort_unless(in_array($request->user()->role, ['admin', 'staff'], true), 403); abort_unless($payment->payment_method === 'cash', 422, 'Only cash payments can be confirmed manually.');
        $data = $request->validate(['transaction_reference' => 'nullable|string|max:255']); return $this->markPaid($payment, $data['transaction_reference'] ?? null);
    }

    /** Polling endpoint: online payments are verified server-to-server. */
    public function verify(VerifyPaymentRequest $request, Payment $payment)
    {
        abort_unless($request->user()->role !== 'customer' || $payment->customer_id === $request->user()->id, 403); abort_unless($payment->payment_method !== 'cash', 422, 'Cash payments are confirmed by staff.');
        $data = $request->validated(); $result = $this->payments->verify($payment, $data['provider_transaction_id'] ?? null);
        return $result['status'] === 'paid' ? $this->markPaid($payment, $result['provider_transaction_id'] ?? null) : $this->markResult($payment, $result);
    }

    /** Provider callbacks never trust callback status; gateway verification decides the final state. */
    public function webhook(Request $request)
    {
        $reference = $request->input('transaction_reference') ?? $request->input('outTradeNo'); abort_unless($reference, 422, 'Missing transaction reference.');
        $payment = Payment::where('transaction_reference', $reference)->firstOrFail(); $result = $this->payments->verify($payment, $request->input('provider_transaction_id'));
        return $result['status'] === 'paid' ? $this->markPaid($payment, $result['provider_transaction_id'] ?? null) : $this->markResult($payment, $result);
    }

    public function orderPayments(Request $request, Order $order) { abort_unless($request->user()->role !== 'customer' || $order->customer_id === $request->user()->id, 403); return $order->payments()->latest()->get(); }

    private function markPaid(Payment $payment, ?string $providerTransactionId = null)
    {
        return DB::transaction(function () use ($payment, $providerTransactionId) { $payment = Payment::lockForUpdate()->findOrFail($payment->id); if ($payment->status === 'paid') return $payment->fresh(); $payment->update(['status' => 'paid', 'paid_at' => now(), 'provider_transaction_id' => $providerTransactionId ?: $payment->provider_transaction_id, 'failure_reason' => null]); $payment->order->update(['payment_status' => 'paid']); $payment->customer->notify(new PaymentStatusChanged($payment)); return $payment->fresh(); });
    }

    private function markResult(Payment $payment, array $result) { if (in_array($result['status'], ['failed', 'cancelled'], true)) $payment->update(['status' => $result['status'], 'failure_reason' => $result['failure_reason'] ?? null]); return $payment->fresh(); }
}
