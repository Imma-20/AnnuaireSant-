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
        Schema::create('stock_produits', function (Blueprint $table) {
            $table->id('id_stock');
            $table->foreignId('id_structure')->constrained('structures_santes', 'id_structure')->onDelete('cascade');
            $table->foreignId('id_produit')->constrained('produits', 'id_produit')->onDelete('cascade');
            $table->unsignedInteger('quantite_disponible')->default(0);
            $table->enum('statut_stock', ['disponible', 'stock_critique', 'indisponible'])->default('disponible');
            $table->timestamps(); // date_mise_a_jour est incluse dans les timestamps par défaut
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_produits');
    }
};
