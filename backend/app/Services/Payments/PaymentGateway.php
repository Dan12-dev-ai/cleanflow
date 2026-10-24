<?php

namespace App\Services\Payments;

use App\Models\Payment;

interface PaymentGateway
{
    /** @return array<string, mixed> */
    public function create(Payment $payment): array;

    /** @return array{status:string, provider_transaction_id?:string, failure_reason?:string} */
    public function verify(Payment $payment, ?string $providerTransactionId = null): array;
}
