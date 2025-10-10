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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('ai_tool_id')->constrained()->onDelete('cascade');
            $table->integer('rating')->unsigned()->min(1)->max(5);
            $table->text('comment');
            $table->timestamps();
            
            // Ensure a user can only review a tool once
            $table->unique(['user_id', 'ai_tool_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
