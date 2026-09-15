<?php

namespace App\Models;

use App\Enums\JobOrderType;
use App\Enums\TicketStatus;
use Illuminate\Database\Eloquent\Model;

class JobOrder extends Model
{
    protected $guarded = [];

    protected $appends = [
        'has_pending_ticket'
    ];

    protected function casts(): array
    {
        return [
            'next_schedule_date' => 'datetime',
            'date'               => 'datetime',
            'job_order_type'     => JobOrderType::class,
            'purchase_date'      => 'datetime',
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

    public function mechanics()
    {
        return $this->belongsToMany(Mechanic::class)
            ->withTimestamps();
    }

    public function jobOrderDetailsByJobRequestType()
    {
        return $this->hasMany(JobOrderDetail::class)
            ->where('type', 'job_request')
            ->where('amount', '>', 0)
            ->whereNotIn('category', ['Upholstery', 'Contractor'])
            ->where('category', 'NOT LIKE', '%rescue%');
    }

    public function jobOrderDetailsByPartsReplacementType()
    {
        return $this->hasMany(JobOrderDetail::class)
            ->where('type', 'parts_replacement')
            ->where('amount', '>', 0);
    }

    public function jobOrderDiagnosis()
    {
        return $this->hasMany(JobOrderDiagnosis::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function getHasPendingTicketAttribute()
    {
        return $this->tickets()
            ->where('status', TicketStatus::PENDING)
            ->latest()
            ->exists();
    }
}
