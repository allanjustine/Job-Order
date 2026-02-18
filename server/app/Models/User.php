<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\RoleName;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token'
    ];

    protected $appends = [
        "redirect_url",
        'is_admin'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }

    public function isAdmin()
    {
        return $this->hasRole(RoleName::ADMIN);
    }

    public function getRedirectUrlAttribute()
    {
        return $this->isAdmin() ? "/admin/dashboard" : "/dashboard";
    }

    public function getIsAdminAttribute()
    {
        return $this->isAdmin();
    }

    public function jobOrders()
    {
        return $this->hasManyThrough(JobOrder::class, Customer::class);
    }

    public function targetIncomes()
    {
        return $this->hasMany(TargetIncome::class);
    }

    public function mechanics()
    {
        return $this->hasMany(Mechanic::class);
    }

    public function areaManagers()
    {
        return $this->belongsToMany(AreaManager::class);
    }

    public function userExportLog()
    {
        return $this->hasOne(UserExportLog::class);
    }
}
