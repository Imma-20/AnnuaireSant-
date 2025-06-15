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
        Schema::create('structure_services', function (Blueprint $table) {
            $table->foreignId('id_structure')->constrained('structures_santes', 'id_structure')->onDelete('cascade');
            $table->foreignId('id_service')->constrained('services', 'id_service')->onDelete('cascade');
            $table->enum('disponibilite', ['disponible', 'indisponible', 'sur_rendez_vous'])->default('disponible');
            $table->text('informations_supplementaires')->nullable();
            $table->timestamps();

            $table->primary(['id_structure', 'id_service']); // Clé primaire composite
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('structure_services');
    }
};
