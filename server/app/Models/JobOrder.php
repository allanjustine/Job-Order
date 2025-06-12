<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOrder extends Model
{
    protected $guarded = [];

    public function jobs()
    {
        return $this->hasMany(JobRequest::class)
            ->chaperone();
    }

    public function parts()
    {
        return $this->hasMany(PartsRequest::class)
            ->chaperone();
    }
}
