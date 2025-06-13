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
        Schema::create('visual_checks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_order_id')->constrained()->cascadeOnDelete();
            $table->boolean('broken')->default(false);
            $table->boolean('dent')->default(false);
            $table->boolean('missing')->default(false);
            $table->boolean('scratch')->default(false);
            $table->string('broken_note')->nullable();
            $table->string('dent_note')->nullable();
            $table->string('missing_note')->nullable();
            $table->string('scratch_note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visual_checks');
    }
};
