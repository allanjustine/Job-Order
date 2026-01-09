<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = [
            [
                "branch_code" => "HO",
                "branch_name" => "Head Office",
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "branch_code" => "SMCT",
                "branch_name" => "Strong Moto Centrum, Inc.",
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "branch_code" => "DSM",
                "branch_name" => "Des Strong Motors, Inc.",
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "branch_code" => "HD",
                "branch_name" => "Honda Des, Inc.",
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "branch_code" => "DAP",
                "branch_name" => "Des Appliance Plaza, Inc.",
                "created_at" => now(),
                "updated_at" => now(),
            ],
        ];

        Branch::query()
            ->insert($branches);
    }
}
