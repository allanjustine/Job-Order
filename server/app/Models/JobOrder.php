<?php

namespace App\Models;

use App\Enums\JobOrderType;
use Illuminate\Database\Eloquent\Model;

class JobOrder extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'next_schedule_date' => 'datetime',
            'date'               => 'datetime',
            'job_order_type'     => JobOrderType::class,
        ];
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function jobOrderDetails()
    {
        return $this->hasMany(JobOrderDetail::class);
    }

    public function mechanic()
    {
        return $this->belongsTo(Mechanic::class);
    }
}
