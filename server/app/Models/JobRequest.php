<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobRequest extends Model
{
    protected $guarded = [];

    protected $appends = [
        "total_cost",
    ];

    public function jobOrder()
    {
        return $this->belongsTo(JobOrder::class);
    }

    public function getTotalCostAttribute()
    {
        return $this->sum("cost");
    }
}
