<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePaymentRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }
    public function rules(): array { return ['order_id' => ['required', 'integer', 'exists:orders,id'], 'payment_method' => ['required', 'in:cash,telebirr,cbe,bank']]; }
}
