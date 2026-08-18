<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administrator extends Model
{
    protected $primaryKey = 'admin_id'; protected $fillable = ['user_id','hire_date'];
    public function user() { return $this->belongsTo(User::class); }
}
