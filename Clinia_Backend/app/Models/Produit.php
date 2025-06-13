<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Produit extends Model
{
    use HasFactory;

    protected $table = 'produits';
    protected $primaryKey = 'id_produit';

    protected $fillable = [
        'nom_produit',
        'description',
        'categorie',
        'code_produit',
    ];

    /**
     * Relation Many-to-Many avec les structures de santé via le stock.
     */
    public function structuresEnStock(): BelongsToMany
    {
        return $this->belongsToMany(StructureSante::class, 'stock_produits', 'id_produit', 'id_structure')
                    ->withPivot('quantite_disponible', 'statut_stock')
                    ->withTimestamps();
    }
}
