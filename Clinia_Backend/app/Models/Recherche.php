<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Recherche extends Model
{
    use HasFactory;

    protected $table = 'recherches';
    protected $primaryKey = 'id_recherche';

    protected $fillable = [
        'id_utilisateur',
        'termes_recherche',
        'filtres_appliques',
        'resultats_nombre',
        'localisation_recherche',
    ];

    protected $casts = [
        'filtres_appliques' => 'array', // Convertit le JSON en tableau PHP
    ];

    /**
     * Relation avec l'utilisateur qui a effectué la recherche (peut être nulle).
     */
    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur', 'id_utilisateur');
    }
}
