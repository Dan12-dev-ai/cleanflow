<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = ['name','category','description','price','duration','status'];
    protected function casts(): array { return ['price' => 'decimal:2']; }
    public function orderItems() { return $this->hasMany(OrderItem::class); }
    public function priceTiers() { return $this->hasMany(ServicePrice::class); }
}
