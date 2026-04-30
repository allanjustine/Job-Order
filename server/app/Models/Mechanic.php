<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mechanic extends Model
{
    protected $guarded = [];

    protected $hidden = [
        'pivot'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobOrders()
    {
        return $this->belongsToMany(JobOrder::class)
            ->withTimestamps();
    }
}
