<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                "name" => "Head Office",
                "code" => "HO",
                "email" => "admin@gmail.com",
                "password" => "Smct123456",
                "branch_id" => 1,
                "created_at" => now(),
                "updated_at" => now(),
            ],
        ];

        User::insert($users);
    }
}
