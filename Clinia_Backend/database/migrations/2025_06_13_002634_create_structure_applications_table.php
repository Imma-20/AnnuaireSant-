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
        Schema::create('structure_applications', function (Blueprint $table) {
            $table->id('id_application');
            $table->string('nom_structure');
            $table->enum('type_structure', ['pharmacie', 'hopital', 'laboratoire', 'clinique', 'centre_medical', 'autre']);
            $table->string('adresse')->nullable();
            $table->string('quartier')->nullable();
            $table->string('ville')->nullable();
            $table->string('commune')->nullable();
            $table->string('departement')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('telephone_principal')->nullable();
            $table->string('telephone_secondaire')->nullable();
            $table->string('email_contact')->unique(); // L'email de contact sera utilisé pour le compte de la structure
            $table->string('site_web')->nullable();
            $table->json('horaires_ouverture')->nullable();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->foreignId('id_utilisateur_soumissionnaire')->constrained('utilisateurs', 'id_utilisateur')->onDelete('cascade'); // L'utilisateur qui a soumis la demande
            $table->enum('statut_demande', ['en_attente', 'approuve', 'rejete'])->default('en_attente');
            $table->text('motif_rejet')->nullable(); // Pour les admins en cas de rejet
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('structure_applications');
    }
};
