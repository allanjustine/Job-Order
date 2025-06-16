<?php

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
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('chassis');
            $table->dateTimeTz('date');
            $table->dateTimeTz('date_sold');
            $table->string('dealer');
            $table->enum('type_of_job', ['pms', 'rr', 'wc']);
            $table->string('mileage');
            $table->dateTimeTz('repair_job_end');
            $table->dateTimeTz('repair_job_start');
            $table->string('vehicle_model');
            $table->string('service_advisor');
            $table->string('branch_manager');
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
