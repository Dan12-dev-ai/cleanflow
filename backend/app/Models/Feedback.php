<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $fillable = ['name', 'rating', 'message', 'status'];
    protected function casts(): array { return ['rating' => 'integer']; }
}
