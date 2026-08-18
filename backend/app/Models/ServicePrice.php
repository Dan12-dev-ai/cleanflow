<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicePrice extends Model
{
    protected $primaryKey = 'price_id'; protected $fillable = ['service_id','min_weight','max_weight','price'];
    public function service() { return $this->belongsTo(Service::class); }
    protected function casts(): array { return ['min_weight'=>'decimal:2', 'max_weight'=>'decimal:2', 'price'=>'decimal:2']; }
}
