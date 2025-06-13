<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StructureAssurance extends Model
{
    use HasFactory;

    protected $table = 'structure_assurances'; // Nom de la table pivot
    // Pas de clé primaire 'id' par défaut, on utilise la clé composite
    // Si vous aviez ajouté un ID auto-incrémenté à cette table, vous le spécifieriez ici.
    // protected $primaryKey = 'id_composite';

    public $incrementing = false; // Ne pas considérer 'id' comme auto-incrémenté
    protected $keyType = 'string'; // Peut être 'string' si la clé primaire composite n'est pas un entier

    // Laravel ne gère pas les clés primaires composites par défaut dans le modèle.
    // L'accès se fera principalement via les relations BelongsToMany ou en construisant des requêtes manuelles.

    protected $fillable = [
        'id_structure',
        'id_assurance',
        'modalites_specifiques',
    ];

    /**
     * Relation vers la structure de santé associée.
     */
    public function structure(): BelongsTo
    {
        return $this->belongsTo(StructureSante::class, 'id_structure', 'id_structure');
    }

    /**
     * Relation vers la compagnie d'assurance associée.
     */
    public function assurance(): BelongsTo
    {
        return $this->belongsTo(CompagnieAssurance::class, 'id_assurance', 'id_assurance');
    }
}
