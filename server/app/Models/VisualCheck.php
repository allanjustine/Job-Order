<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisualCheck extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            "broken"        => "boolean",
            "dent"          => "boolean",
            "missing"       => "boolean",
            "scratch"       => "boolean",
        ];
    }

    public function jobOrder()
    {
        return $this->belongsTo(JobOrder::class);
    }
}
