<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CompagnieAssurance extends Model
{
    use HasFactory;

    protected $table = 'compagnies_assurances';
    protected $primaryKey = 'id_assurance';

    protected $fillable = [
        'nom_assurance',
        'logo',
        'description',
        'contact',
        'site_web',
    ];

    /**
     * Relation Many-to-Many avec les structures de santé.
     */
    public function structures(): BelongsToMany
    {
        return $this->belongsToMany(StructureSante::class, 'structure_assurances', 'id_assurance', 'id_structure')
                    ->withPivot('modalites_specifiques')
                    ->withTimestamps();
    }
}