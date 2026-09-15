<?php

use App\Models\JobOrder;
use App\Models\TicketBrand;
use App\Models\TicketCategory;
use App\Models\User;
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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class, 'edited_by')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(TicketCategory::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(TicketBrand::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(JobOrder::class)->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('ticket_code')->unique();
            $table->string('status')->default('pending');
            $table->text('description');
            $table->text('rejected_reason')->nullable();
            $table->timestamp('edited_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
