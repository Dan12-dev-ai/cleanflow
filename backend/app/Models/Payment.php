<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['order_id','customer_id','amount','currency','payment_method','transaction_reference','provider_transaction_id','status','paid_at','failure_reason'];
    protected function casts(): array { return ['amount'=>'decimal:2','paid_at'=>'datetime']; }
    public function order() { return $this->belongsTo(Order::class); }
    public function customer() { return $this->belongsTo(User::class, 'customer_id'); }
    public function receipt() { return $this->hasOne(Receipt::class); }
}
