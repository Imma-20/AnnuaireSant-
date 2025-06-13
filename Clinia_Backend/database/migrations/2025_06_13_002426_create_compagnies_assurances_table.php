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
        Schema::create('compagnies_assurances', function (Blueprint $table) {
            $table->id('id_assurance');
            $table->string('nom_assurance')->unique();
            $table->string('logo')->nullable(); // Chemin vers l'image du logo
            $table->text('description')->nullable();
            $table->string('contact')->nullable();
            $table->string('site_web')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compagnies_assurances');
    }
};
