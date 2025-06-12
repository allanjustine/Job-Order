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
            $table->string('vehicle_model');
            $table->string('chassis');
            $table->string('dealer');
            $table->string('mileage');
            $table->dateTimeTz('date_sold');
            $table->enum('type_of_job', ['pms', 'rr', 'wc']);
            $table->dateTimeTz('repair_job_start');
            $table->dateTimeTz('repair_job_end');
            $table->enum('vehicle_document', ['otk', 'om', 'wgb', 'others']);
            $table->string('vehicle_document_others')->nullable();
            $table->enum('vehicle_visual', ['dent', 'scratch', 'broken', 'missing']);
            $table->string('vehicle_visual_others')->nullable();
            $table->string('totalLabor')->nullable();
            $table->string('parts_lubricants_request_id')->nullable();
            $table->string('totalParts')->nullable();
            $table->string('totalAmount')->nullable();
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
