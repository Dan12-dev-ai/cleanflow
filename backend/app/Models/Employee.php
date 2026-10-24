<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $primaryKey = 'employee_id'; protected $fillable = ['user_id','employee_code','hire_date','salary','status'];
    public function user() { return $this->belongsTo(User::class); }
    public function orders() { return $this->hasMany(Order::class, 'employee_id'); }
    protected function casts(): array { return ['hire_date'=>'date', 'salary'=>'decimal:2']; }
}
