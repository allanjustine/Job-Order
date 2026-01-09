<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AreaManager extends Model
{
    protected $guarded = [];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
