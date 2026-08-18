<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('customer_record_id');
            $table->dropConstrainedForeignId('employee_id');
        });
        Schema::table('users', fn (Blueprint $table) => $table->dropConstrainedForeignId('role_id'));

        foreach (['receipts', 'invoices', 'service_prices', 'inventory_usages', 'reports', 'administrators', 'employees', 'customers', 'roles'] as $table) {
            Schema::dropIfExists($table);
        }
    }

    public function down(): void
    {
        // The removed legacy tables should only be restored from a backup.
    }
};
