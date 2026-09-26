<?php

namespace App\Models;

use App\Enums\TicketStatus;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'status'    => TicketStatus::class,
            'edited_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function editedBy()
    {
        return $this->belongsTo(User::class, 'edited_by');
    }

    public function rejectedBy()
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function notes()
    {
        return $this->hasMany(TicketNote::class);
    }

    public function attachments()
    {
        return $this->hasMany(TicketAttachment::class);
    }

    public function changeRequests()
    {
        return $this->hasMany(TicketChangeRequest::class);
    }

    public function category()
    {
        return $this->belongsTo(TicketCategory::class);
    }

    public function brand()
    {
        return $this->belongsTo(TicketBrand::class);
    }

    public function jobOrder()
    {
        return $this->belongsTo(JobOrder::class);
    }

    public function ticketCategory()
    {
        return $this->belongsTo(TicketCategory::class);
    }

    public function ticketBrand()
    {
        return $this->belongsTo(TicketBrand::class);
    }
}
