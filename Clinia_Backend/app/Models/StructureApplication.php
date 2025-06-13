<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StructureApplication extends Model
{
    use HasFactory;

    protected $table = 'structure_applications';
    protected $primaryKey = 'id_application';

    protected $fillable = [
        'nom_structure',
        'type_structure',
        'adresse',
        'quartier',
        'ville',
        'commune',
        'departement',
        'latitude',
        'longitude',
        'telephone_principal',
        'telephone_secondaire',
        'email_contact',
        'site_web',
        'horaires_ouverture',
        'description',
        'logo',
        'id_utilisateur_soumissionnaire',
        'statut_demande',
        'motif_rejet',
    ];

    protected $casts = [
        'horaires_ouverture' => 'array',
    ];

    /**
     * Relation avec l'utilisateur qui a soumis l'application.
     */
    public function soumissionnaire(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur_soumissionnaire', 'id_utilisateur');
    }
}
