<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockProduit extends Model
{
    use HasFactory;

    protected $table = 'stock_produits'; // Nom de la table pivot
    protected $primaryKey = 'id_stock'; // Clé primaire de la table pivot

    protected $fillable = [
        'id_structure',
        'id_produit',
        'quantite_disponible',
        'statut_stock',
    ];

    /**
     * Relation vers la structure de santé associée.
     */
    public function structure(): BelongsTo
    {
        return $this->belongsTo(StructureSante::class, 'id_structure', 'id_structure');
    }

    /**
     * Relation vers le produit associé.
     */
    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'id_produit', 'id_produit');
    }
}
