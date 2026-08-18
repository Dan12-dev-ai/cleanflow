<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = ['order_id','service_id','quantity','weight','unit_price','subtotal'];
    protected function casts(): array { return ['quantity'=>'decimal:2','weight'=>'decimal:2','unit_price'=>'decimal:2','subtotal'=>'decimal:2']; }
    public function order() { return $this->belongsTo(Order::class); }
    public function service() { return $this->belongsTo(Service::class); }
}
