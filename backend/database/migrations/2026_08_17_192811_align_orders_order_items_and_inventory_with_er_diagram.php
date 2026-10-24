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
        Schema::table('orders', function (Blueprint $table) { $table->foreignId('customer_record_id')->nullable()->after('customer_id')->constrained('customers', 'customer_id')->nullOnDelete(); $table->string('category')->nullable()->after('clothes_type'); $table->timestamp('due_date')->nullable()->after('order_date'); });
        Schema::table('order_items', function (Blueprint $table) { $table->decimal('weight', 10, 2)->nullable()->after('quantity'); });
        Schema::table('inventory_items', function (Blueprint $table) { $table->string('category')->nullable()->after('name'); $table->decimal('reorder_level', 12, 2)->nullable()->after('minimum_threshold'); });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) { $table->dropConstrainedForeignId('customer_record_id'); $table->dropColumn(['category','due_date']); });
        Schema::table('order_items', function (Blueprint $table) { $table->dropColumn('weight'); });
        Schema::table('inventory_items', function (Blueprint $table) { $table->dropColumn(['category','reorder_level']); });
    }
};
