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
        Schema::create('recherches', function (Blueprint $table) {
            $table->id('id_recherche');
            $table->foreignId('id_utilisateur')->nullable()->constrained('utilisateurs', 'id_utilisateur')->onDelete('set null'); // Peut être NULL pour recherches anonymes
            $table->string('termes_recherche');
            $table->json('filtres_appliques')->nullable(); // Stocke les filtres au format JSON
            $table->unsignedInteger('resultats_nombre')->nullable();
            $table->string('localisation_recherche')->nullable(); // Peut être une chaîne ou des coordonnées GPS si besoin de plus de détail
            $table->timestamps(); // date_recherche
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recherches');
    }
};
