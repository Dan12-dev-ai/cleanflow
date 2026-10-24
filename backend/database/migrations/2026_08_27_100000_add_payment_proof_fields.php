<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'proof_path')) $table->string('proof_path')->nullable()->after('failure_reason');
            if (!Schema::hasColumn('payments', 'verified_at')) $table->timestamp('verified_at')->nullable()->after('proof_path');
            if (!Schema::hasColumn('payments', 'verified_by')) $table->foreignId('verified_by')->nullable()->after('verified_at')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (Schema::hasColumn('payments', 'verified_by')) $table->dropConstrainedForeignId('verified_by');
            foreach (['proof_path', 'verified_at'] as $column) if (Schema::hasColumn('payments', $column)) $table->dropColumn($column);
        });
    }
};
