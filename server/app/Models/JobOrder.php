<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOrder extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'repair_job_end'    => 'datetime',
            'repair_job_start'  => 'datetime',
            'date'              => 'datetime',
            'date_sold'         => 'datetime'
        ];
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function jobRequests()
    {
        return $this->hasMany(JobRequest::class)
            ->chaperone();
    }

    public function partsRequests()
    {
        return $this->hasMany(PartsRequest::class)
            ->chaperone();
    }
    public function document()
    {
        return $this->hasOne(Document::class);
    }
    public function visualCheck()
    {
        return $this->hasOne(VisualCheck::class);
    }
}
