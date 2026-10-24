<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['order_number','customer_id','service_id','phone','clothes_type','category','quantity','unit','pickup_date','pickup_address','special_instructions','total_amount','status','payment_status','assigned_staff_id','order_date','due_date'];
    protected function casts(): array { return ['pickup_date' => 'date', 'order_date'=>'datetime', 'due_date'=>'datetime', 'quantity' => 'decimal:2', 'total_amount' => 'decimal:2']; }
    public function customer() { return $this->belongsTo(User::class, 'customer_id'); }
    public function staff() { return $this->belongsTo(User::class, 'assigned_staff_id'); }
    public function service() { return $this->belongsTo(Service::class); }
    public function items() { return $this->hasMany(OrderItem::class); }
    public function payments() { return $this->hasMany(Payment::class); }
    public function delivery() { return $this->hasOne(Delivery::class); }
}
