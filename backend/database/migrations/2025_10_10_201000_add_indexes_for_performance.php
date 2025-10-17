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
        // Add indexes for AI tools table
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->index('status');
            $table->index('category');
            $table->index('price_tier');
            $table->index('is_featured');
            $table->index('user_id');
            $table->index('created_at');
            $table->index(['status', 'category']);
            $table->index(['status', 'is_featured']);
        });

        // Add indexes for users table
        Schema::table('users', function (Blueprint $table) {
            $table->index('role');
            $table->index('email');
            $table->index('created_at');
        });

        // Add indexes for reviews table
        Schema::table('reviews', function (Blueprint $table) {
            $table->index('ai_tool_id');
            $table->index('user_id');
            $table->index('rating');
            $table->index('created_at');
            $table->index(['ai_tool_id', 'user_id']);
        });

        // Add indexes for personal_access_tokens table
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->index('tokenable_id');
            $table->index('tokenable_type');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove indexes from AI tools table
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['category']);
            $table->dropIndex(['price_tier']);
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['status', 'category']);
            $table->dropIndex(['status', 'is_featured']);
        });

        // Remove indexes from users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['email']);
            $table->dropIndex(['created_at']);
        });

        // Remove indexes from reviews table
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['ai_tool_id']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['rating']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['ai_tool_id', 'user_id']);
        });

        // Remove indexes from personal_access_tokens table
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropIndex(['tokenable_id']);
            $table->dropIndex(['tokenable_type']);
            $table->dropIndex(['created_at']);
        });
    }
};
