<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $guarded = [];

    public function jobOrders()
    {
        return $this->hasMany(JobOrder::class)
            ->chaperone();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
