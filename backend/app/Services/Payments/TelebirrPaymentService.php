<?php

namespace App\Services\Payments;

use App\Models\Payment;
use RuntimeException;

class TelebirrPaymentService implements PaymentGateway
{
    public function create(Payment $payment): array
    {
        if (! config('services.telebirr.merchant_id') || ! config('services.telebirr.checkout_url')) {
            return ['status' => 'awaiting_proof', 'instructions' => 'Send the exact amount to the Telebirr account, then upload your confirmation screenshot and transaction reference.', 'account_name' => config('services.telebirr.account_name', 'CleanFlow Laundry'), 'account_number' => config('services.telebirr.account_number', '0912345678'), 'provider' => 'Telebirr'];
        }

        // Implement the authorized merchant API request here. Never expose its keys to React.
        throw new RuntimeException('Telebirr checkout creation must be completed with the authorized merchant API specification.');
    }

    public function verify(Payment $payment, ?string $providerTransactionId = null): array
    {
        // Implement server-to-server verification using Telebirr's official merchant API.
        throw new RuntimeException('Telebirr verification is not configured.');
    }
}
