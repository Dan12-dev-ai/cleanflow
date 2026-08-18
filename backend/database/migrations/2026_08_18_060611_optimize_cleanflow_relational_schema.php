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
        Schema::table('users', function (Blueprint $table) { $table->index(['role_id', 'status'], 'users_role_status_idx'); });
        Schema::table('orders', function (Blueprint $table) { $table->index(['customer_record_id', 'status', 'created_at'], 'orders_customer_status_created_idx'); $table->index(['employee_id', 'status', 'due_date'], 'orders_employee_status_due_idx'); $table->index(['payment_status', 'created_at'], 'orders_payment_created_idx'); });
        Schema::table('order_items', function (Blueprint $table) { $table->index(['service_id', 'order_id'], 'order_items_service_order_idx'); });
        Schema::table('payments', function (Blueprint $table) { $table->index(['customer_id', 'status', 'paid_at'], 'payments_customer_status_paid_idx'); });
        Schema::table('deliveries', function (Blueprint $table) { $table->index(['staff_id', 'status', 'pickup_date'], 'deliveries_staff_status_pickup_idx'); });
        Schema::table('tasks', function (Blueprint $table) { $table->index(['assigned_to', 'status', 'due_date'], 'tasks_assignee_status_due_idx'); });
        Schema::table('inventory_items', function (Blueprint $table) { $table->index(['status', 'category'], 'inventory_status_category_idx'); });
        Schema::table('inventory_usages', function (Blueprint $table) { $table->index(['order_id', 'usage_date'], 'inventory_usage_order_date_idx'); });
        Schema::table('activity_logs', function (Blueprint $table) { $table->index(['user_id', 'created_at'], 'activity_logs_user_created_idx'); });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) { $table->dropIndex('activity_logs_user_created_idx'); });
        Schema::table('inventory_usages', function (Blueprint $table) { $table->dropIndex('inventory_usage_order_date_idx'); });
        Schema::table('inventory_items', function (Blueprint $table) { $table->dropIndex('inventory_status_category_idx'); });
        Schema::table('tasks', function (Blueprint $table) { $table->dropIndex('tasks_assignee_status_due_idx'); });
        Schema::table('deliveries', function (Blueprint $table) { $table->dropIndex('deliveries_staff_status_pickup_idx'); });
        Schema::table('payments', function (Blueprint $table) { $table->dropIndex('payments_customer_status_paid_idx'); });
        Schema::table('order_items', function (Blueprint $table) { $table->dropIndex('order_items_service_order_idx'); });
        Schema::table('orders', function (Blueprint $table) { $table->dropIndex('orders_customer_status_created_idx'); $table->dropIndex('orders_employee_status_due_idx'); $table->dropIndex('orders_payment_created_idx'); });
        Schema::table('users', function (Blueprint $table) { $table->dropIndex('users_role_status_idx'); });
    }
};
