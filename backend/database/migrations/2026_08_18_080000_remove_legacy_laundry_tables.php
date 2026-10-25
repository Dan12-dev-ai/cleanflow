<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite cannot drop a column while an index still references it. Drop every
        // index on the affected tables first (SQLite only).
        $this->dropAllIndexes('orders');
        $this->dropAllIndexes('users');

        // Named indexes from the optimize migration (kept for non-SQLite drivers
        // where sqlite_master is unavailable).
        foreach (['orders_customer_status_created_idx', 'orders_employee_status_due_idx', 'users_role_status_idx', 'orders_payment_created_idx'] as $index) {
            try {
                DB::statement('DROP INDEX IF EXISTS "'.$index.'"');
            } catch (Throwable $e) {
                // ignore
            }
        }

        // On SQLite, dropping columns can fail if a stale index still references them.
        // Legacy columns are harmless, so only drop them on drivers that handle it cleanly.
        if (DB::getDriverName() !== 'sqlite') {
            foreach (['customer_record_id', 'employee_id'] as $column) {
                if (! Schema::hasColumn('orders', $column)) {
                    continue;
                }
                try {
                    Schema::table('orders', function (Blueprint $table) use ($column) {
                        $table->dropConstrainedForeignId($column);
                    });
                } catch (Throwable $e) {
                    try {
                        Schema::table('orders', function (Blueprint $table) use ($column) {
                            $table->dropColumn($column);
                        });
                    } catch (Throwable $e2) {
                        // ignore - keep legacy column
                    }
                }
            }
            if (Schema::hasColumn('users', 'role_id')) {
                try {
                    Schema::table('users', function (Blueprint $table) {
                        $table->dropConstrainedForeignId('role_id');
                    });
                } catch (Throwable $e) {
                    try {
                        Schema::table('users', function (Blueprint $table) {
                            $table->dropColumn('role_id');
                        });
                    } catch (Throwable $e2) {
                        // ignore
                    }
                }
            }
        }

        foreach (['receipts', 'invoices', 'service_prices', 'inventory_usages', 'reports', 'administrators', 'employees', 'customers', 'roles'] as $table) {
            Schema::dropIfExists($table);
        }
    }

    protected function dropAllIndexes(string $table): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            return;
        }

        try {
            $indexes = DB::select(
                "select name from sqlite_master where type = 'index' and tbl_name = ? and sql is not null",
                [$table]
            );
        } catch (Throwable $e) {
            return;
        }

        foreach ($indexes as $index) {
            $name = $index->name;
            if (str_starts_with($name, 'sqlite_autoindex_')) {
                continue;
            }
            try {
                DB::statement('DROP INDEX IF EXISTS "'.$name.'"');
            } catch (Throwable $e) {
                // ignore
            }
        }
    }

    public function down(): void
    {
        // The removed legacy tables should only be restored from a backup.
    }
};
