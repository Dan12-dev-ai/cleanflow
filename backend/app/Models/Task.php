<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $guarded = []; protected function casts(): array { return ['due_date'=>'date','completed_at'=>'datetime']; }
    public function assignee() { return $this->belongsTo(User::class, 'assigned_to'); }
    public function order() { return $this->belongsTo(Order::class); }
}
