<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    use HasFactory;

    protected $table = 'services';
    protected $primaryKey = 'id_service';

    protected $fillable = [
        'nom_service',
        'description',
        'categorie',
    ];

    /**
     * Relation Many-to-Many avec les structures de santé.
     */
    public function structures(): BelongsToMany
    {
        return $this->belongsToMany(StructureSante::class, 'structure_services', 'id_service', 'id_structure')
                    ->withPivot('disponibilite', 'informations_supplementaires')
                    ->withTimestamps();
    }
}