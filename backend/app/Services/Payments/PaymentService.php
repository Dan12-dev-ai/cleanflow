<?php

namespace App\Services\Payments;

use App\Models\Payment;
use InvalidArgumentException;

class PaymentService
{
    public function gateway(string $method): PaymentGateway
    {
        return match ($method) {
            'cash' => app(CashPaymentService::class),
            'telebirr' => app(TelebirrPaymentService::class),
            'bank', 'cbe' => app(BankPaymentService::class),
            default => throw new InvalidArgumentException('Unsupported payment method.'),
        };
    }

    /** @return array<string, mixed> */
    public function create(Payment $payment): array
    {
        return $this->gateway($payment->payment_method)->create($payment);
    }

    /** @return array{status:string, provider_transaction_id?:string, failure_reason?:string} */
    public function verify(Payment $payment, ?string $providerTransactionId = null): array
    {
        return $this->gateway($payment->payment_method)->verify($payment, $providerTransactionId);
    }
}
