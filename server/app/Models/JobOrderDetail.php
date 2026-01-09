<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOrderDetail extends Model
{
    protected $guarded = [];

    public function jobOrder()
    {
        return $this->belongsTo(JobOrder::class);
    }
}
