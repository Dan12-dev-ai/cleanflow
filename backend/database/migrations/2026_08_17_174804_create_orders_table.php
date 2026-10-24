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
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); $table->string('order_number')->unique();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('service_id')->nullable()->index();
            $table->string('phone'); $table->string('clothes_type'); $table->decimal('quantity', 10, 2); $table->string('unit');
            $table->date('pickup_date'); $table->text('pickup_address'); $table->text('special_instructions')->nullable();
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->enum('status', ['pending','accepted','received','washing','drying','ironing','ready','ready_for_pickup','delivered','cancelled'])->default('pending')->index();
            $table->enum('payment_status', ['pending','paid','failed','refunded'])->default('pending');
            $table->foreignId('assigned_staff_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
