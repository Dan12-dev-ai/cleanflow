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
        Schema::create('inventory_usages', function (Blueprint $table) {
            $table->id('usage_id'); $table->foreignId('item_id')->constrained('inventory_items')->cascadeOnDelete(); $table->foreignId('order_id')->constrained()->cascadeOnDelete(); $table->decimal('quantity_used', 12, 2); $table->foreignId('used_by')->nullable()->constrained('users')->nullOnDelete(); $table->timestamp('usage_date')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_usages');
    }
};
