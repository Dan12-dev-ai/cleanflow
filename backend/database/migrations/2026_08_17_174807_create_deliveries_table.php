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
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id(); $table->foreignId('order_id')->unique()->constrained()->cascadeOnDelete(); $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete(); $table->foreignId('staff_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('pickup_date')->nullable(); $table->time('pickup_time')->nullable(); $table->text('pickup_address'); $table->date('delivery_date')->nullable(); $table->time('delivery_time')->nullable(); $table->text('delivery_address')->nullable();
            $table->enum('status', ['requested','assigned','picked_up','processing','out_for_delivery','delivered','cancelled'])->default('requested'); $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};
