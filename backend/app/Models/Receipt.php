<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    protected $primaryKey = 'receipt_id'; protected $fillable = ['receipt_number','payment_id','receipt_date','total_amount'];
    public function payment() { return $this->belongsTo(Payment::class); }
}
