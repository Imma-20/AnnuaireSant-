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
        Schema::create('articles', function (Blueprint $table) {
            $table->id('id_article');
            $table->string('titre');
            $table->longText('contenu'); // longText pour des contenus plus volumineux
            $table->foreignId('auteur_id')->nullable()->constrained('utilisateurs', 'id_utilisateur')->onDelete('set null'); // FK vers l'auteur
            $table->string('categorie')->nullable();
            $table->json('tags')->nullable(); // Stocke les tags au format JSON
            $table->string('image_principale')->nullable(); // Chemin vers l'image principale
            $table->enum('statut', ['brouillon', 'publie', 'archive'])->default('brouillon');
            $table->timestamps(); // date_publication et date_modification
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
