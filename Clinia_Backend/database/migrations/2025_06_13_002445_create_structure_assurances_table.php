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
        Schema::create('structure_assurances', function (Blueprint $table) {
            $table->foreignId('id_structure')->constrained('structures_sante', 'id_structure')->onDelete('cascade');
            $table->foreignId('id_assurance')->constrained('compagnies_assurance', 'id_assurance')->onDelete('cascade');
            $table->text('modalites_specifiques')->nullable();
            $table->timestamps();

            $table->primary(['id_structure', 'id_assurance']); // Clé primaire composite
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('structure_assurances');
    }
};
