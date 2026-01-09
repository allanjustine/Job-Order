<?php

use App\Models\Customer;
use App\Models\Mechanic;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Customer::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Mechanic::class)->constrained()->cascadeOnDelete();
            $table->string('job_order_type');
            $table->string('job_order_number');
            $table->dateTime('date');
            $table->string('branch_manager');
            $table->string('general_remarks');
            $table->time('repair_end');
            $table->time('repair_start');
            $table->string('service_advisor');
            $table->string('fuel_level');
            $table->string('model');
            $table->string('mileage');
            $table->string('engine_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
