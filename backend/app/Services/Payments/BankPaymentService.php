<?php

namespace App\Services\Payments;

use App\Models\Payment;
use RuntimeException;

class BankPaymentService implements PaymentGateway
{
    public function create(Payment $payment): array
    {
        return ['status' => 'awaiting_proof', 'instructions' => 'Transfer the exact amount, then upload your confirmation screenshot and transaction reference.', 'account_name' => config('services.cbe.account_name', 'CleanFlow Laundry'), 'account_number' => config('services.cbe.account_number', '1000123456789'), 'bank' => 'Commercial Bank of Ethiopia (CBE)'];
    }

    public function verify(Payment $payment, ?string $providerTransactionId = null): array
    {
        return ['status' => 'pending', 'failure_reason' => 'Payment proof is awaiting admin verification.'];
    }
}
