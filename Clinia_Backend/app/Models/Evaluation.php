<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    use HasFactory;

    protected $table = 'evaluations';
    protected $primaryKey = 'id_evaluation';

    protected $fillable = [
        'id_structure',
        'id_utilisateur',
        'note',
        'commentaire',
    ];

    /**
     * Relation avec la structure de santé évaluée.
     */
    public function structure(): BelongsTo
    {
        return $this->belongsTo(StructureSante::class, 'id_structure', 'id_structure');
    }

    /**
     * Relation avec l'utilisateur qui a laissé l'évaluation.
     */
    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur', 'id_utilisateur');
    }
}
