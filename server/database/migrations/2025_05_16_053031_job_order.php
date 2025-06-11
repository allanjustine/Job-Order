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
        $table->string('customerName');
        $table->string('address');
        $table->string('contact');
        $table->string('vehicleModel');
        $table->string('chassis');
        $table->string('dealer');
        $table->string('mileage');
        $table->string('dateSold');
        $table->string('typeOfJob');
        $table->string('repairJobStart');
        $table->string('repairJobEnd');
        $table->string('vehicleDocument');
        $table->string('vehicleDocumentOthers')->nullable();
        $table->string('vehicleVisual');
        $table->string('vehicleVisualOthers')->nullable();
        $table->string('job_requests_id')->nullable();
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
