<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryUsage extends Model
{
    protected $primaryKey = 'usage_id'; protected $fillable = ['item_id','order_id','quantity_used','used_by','usage_date'];
    public function item() { return $this->belongsTo(InventoryItem::class, 'item_id'); }
    public function order() { return $this->belongsTo(Order::class); }
    public function user() { return $this->belongsTo(User::class, 'used_by'); }
    protected function casts(): array { return ['quantity_used'=>'decimal:2','usage_date'=>'datetime']; }
}
