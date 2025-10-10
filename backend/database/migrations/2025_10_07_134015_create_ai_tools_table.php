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
        Schema::create('ai_tools', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('category');
            $table->string('url');
            $table->string('image_url')->nullable();
            $table->json('tags')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('price_tier')->default(1); // 1=Free, 2=Freemium, 3=Paid
            $table->boolean('is_featured')->default(false);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_tools');
    }
};
