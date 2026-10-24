<?php

namespace App\Services\Payments;

use App\Models\Payment;

class CashPaymentService implements PaymentGateway
{
    public function create(Payment $payment): array
    {
        return ['status' => 'pending', 'message' => 'Payment is awaiting staff confirmation.'];
    }

    public function verify(Payment $payment, ?string $providerTransactionId = null): array
    {
        return ['status' => 'pending'];
    }
}
