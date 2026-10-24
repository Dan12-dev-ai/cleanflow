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
        Schema::create('payments', function (Blueprint $table) {
            $table->id(); $table->foreignId('order_id')->constrained()->cascadeOnDelete(); $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('amount', 12, 2); $table->string('currency', 3)->default('ETB'); $table->enum('payment_method', ['cash','telebirr','cbe','bank']); $table->string('transaction_reference')->nullable()->unique(); $table->string('provider_transaction_id')->nullable()->unique();
            $table->enum('status', ['pending','processing','paid','failed','cancelled','refunded'])->default('pending'); $table->timestamp('paid_at')->nullable(); $table->text('failure_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
