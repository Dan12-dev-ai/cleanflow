<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    protected $fillable = ['name','category','quantity','unit','minimum_threshold','reorder_level','status'];
    protected static function booted(): void { static::saving(function ($item) { $item->status = $item->quantity <= $item->minimum_threshold ? 'low_stock' : 'in_stock'; }); }
    public function transactions() { return $this->hasMany(InventoryTransaction::class); }
    public function usages() { return $this->hasMany(InventoryUsage::class, 'item_id'); }
}
