<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    protected $guarded = [];
    protected function casts(): array { return ['pickup_date'=>'date', 'delivery_date'=>'date']; }
    public function order() { return $this->belongsTo(Order::class); }
    public function customer() { return $this->belongsTo(User::class, 'customer_id'); }
    public function staff() { return $this->belongsTo(User::class, 'staff_id'); }
}
