<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StructureService extends Model
{
    use HasFactory;

    protected $table = 'structure_services'; // Nom de la table pivot
    // Pas de clé primaire 'id' par défaut, on utilise la clé composite
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_structure',
        'id_service',
        'disponibilite',
        'informations_supplementaires',
    ];

    /**
     * Relation vers la structure de santé associée.
     */
    public function structure(): BelongsTo
    {
        return $this->belongsTo(StructureSante::class, 'id_structure', 'id_structure');
    }

    /**
     * Relation vers le service associé.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'id_service', 'id_service');
    }
}
