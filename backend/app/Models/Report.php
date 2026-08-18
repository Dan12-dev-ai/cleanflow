<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $primaryKey = 'report_id'; protected $fillable = ['report_name','report_type','generated_date','generated_by'];
    public function generator() { return $this->belongsTo(User::class, 'generated_by'); }
}
