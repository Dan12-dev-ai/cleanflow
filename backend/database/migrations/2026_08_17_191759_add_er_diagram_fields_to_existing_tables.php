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
        Schema::table('users', function (Blueprint $table) { $table->foreignId('role_id')->nullable()->after('role')->constrained('roles', 'role_id')->nullOnDelete(); });
        Schema::table('customer_profiles', function (Blueprint $table) { $table->date('join_date')->nullable()->after('address'); $table->unsignedInteger('loyalty_points')->default(0)->after('join_date'); });
        Schema::table('staff_profiles', function (Blueprint $table) { $table->string('employee_code')->nullable()->unique()->after('position'); $table->date('hire_date')->nullable()->after('employee_code'); $table->decimal('salary',12,2)->nullable()->after('hire_date'); });
        Schema::table('orders', function (Blueprint $table) { $table->foreignId('employee_id')->nullable()->after('assigned_staff_id')->constrained('employees', 'employee_id')->nullOnDelete(); $table->timestamp('order_date')->nullable()->after('pickup_date'); });
        Schema::table('services', function (Blueprint $table) { $table->decimal('base_price',12,2)->nullable()->after('price'); $table->unsignedInteger('estimated_hours')->nullable()->after('duration'); });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) { $table->dropConstrainedForeignId('employee_id'); $table->dropColumn('order_date'); });
        Schema::table('services', function (Blueprint $table) { $table->dropColumn(['base_price','estimated_hours']); });
        Schema::table('staff_profiles', function (Blueprint $table) { $table->dropUnique(['employee_code']); $table->dropColumn(['employee_code','hire_date','salary']); });
        Schema::table('customer_profiles', function (Blueprint $table) { $table->dropColumn(['join_date','loyalty_points']); });
        Schema::table('users', function (Blueprint $table) { $table->dropConstrainedForeignId('role_id'); });
    }
};
