<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (! Schema::hasColumn('payments', 'currency')) $table->string('currency', 3)->default('ETB')->after('amount');
            if (! Schema::hasColumn('payments', 'provider_transaction_id')) $table->string('provider_transaction_id')->nullable()->unique()->after('transaction_reference');
            if (! Schema::hasColumn('payments', 'failure_reason')) $table->text('failure_reason')->nullable()->after('paid_at');
            $table->index(['payment_method', 'status'], 'payments_method_status_idx');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex('payments_method_status_idx');
            $table->dropColumn(['currency', 'provider_transaction_id', 'failure_reason']);
        });
    }
};
