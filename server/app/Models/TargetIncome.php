<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TargetIncome extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'month_of' => 'datetime'
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
