<?php

namespace App\Services\Payments;

use App\Models\Payment;
use RuntimeException;

class BankPaymentService implements PaymentGateway
{
    public function create(Payment $payment): array
    {
        throw new RuntimeException('Bank gateway is not configured.');
    }

    public function verify(Payment $payment, ?string $providerTransactionId = null): array
    {
        throw new RuntimeException('Bank gateway verification is not configured.');
    }
}
