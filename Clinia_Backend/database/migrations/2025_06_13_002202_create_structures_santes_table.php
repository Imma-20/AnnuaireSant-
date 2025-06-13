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
        Schema::create('structures_santes', function (Blueprint $table) {
            $table->id('id_structure');
            $table->string('nom_structure');
            $table->enum('type_structure', ['pharmacie', 'hopital', 'laboratoire', 'clinique', 'centre_medical', 'autre']);
            $table->string('adresse')->nullable();
            $table->string('quartier')->nullable();
            $table->string('ville')->nullable();
            $table->string('commune')->nullable();
            $table->string('departement')->nullable();
            $table->decimal('latitude', 10, 7)->nullable(); // Coordonnées GPS
            $table->decimal('longitude', 10, 7)->nullable(); // Coordonnées GPS
            $table->string('telephone_principal')->nullable();
            $table->string('telephone_secondaire')->nullable();
            $table->string('email_contact')->unique()->nullable();
            $table->string('site_web')->nullable();
            $table->json('horaires_ouverture')->nullable(); // Stocke les horaires au format JSON
            $table->boolean('est_de_garde')->default(false);
            $table->date('periode_garde_debut')->nullable();
            $table->date('periode_garde_fin')->nullable();
            $table->text('description')->nullable();
            $table->string('logo')->nullable(); // Chemin vers l'image du logo
            $table->enum('statut_verification', ['en_attente', 'verifie', 'rejete'])->default('en_attente');
            $table->foreignId('id_utilisateur')->nullable()->constrained('utilisateurs', 'id_utilisateur')->onDelete('set null'); // FK vers l'administrateur de la structure
            $table->timestamps(); // date_creation et date_modification
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('structures_santes');
    }
};
