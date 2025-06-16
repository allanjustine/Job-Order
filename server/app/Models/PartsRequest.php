<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartsRequest extends Model
{
    protected $guarded = [];

    protected $appends = [
        "sub_total_price",
    ];

    public function jobOrder()
    {
        return $this->belongsTo(JobOrder::class);
    }

    public function getSubTotalPriceAttribute()
    {
        return $this->quantity * $this->price;
    }
}
