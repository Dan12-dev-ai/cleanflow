<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $primaryKey = 'customer_id';
    protected $fillable = ['user_id','address','join_date','loyalty_points','status'];
    public function user() { return $this->belongsTo(User::class); }
    public function orders() { return $this->hasMany(Order::class, 'customer_record_id', 'customer_id'); }
    protected function casts(): array { return ['join_date'=>'date', 'loyalty_points'=>'integer']; }
}
