<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            "owner_manual"          => "boolean",
            "owner_toolkit"         => "boolean",
            "warranty_guide_book"   => "boolean",
            "others"                => "boolean",
        ];
    }

    public function jobOrder()
    {
        return $this->belongsTo(JobOrder::class);
    }
}
