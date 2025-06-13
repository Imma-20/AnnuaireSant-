<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StructureSante extends Model
{
    use HasFactory;

    protected $table = 'structures_sante';
    protected $primaryKey = 'id_structure';

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
        'est_de_garde',
        'periode_garde_debut',
        'periode_garde_fin',
        'description',
        'logo',
        'statut_verification',
        'id_utilisateur', // L'utilisateur administrateur de cette structure
    ];

    protected $casts = [
        'horaires_ouverture' => 'array', // Convertit le JSON en tableau PHP
        'est_de_garde' => 'boolean',
        'periode_garde_debut' => 'date',
        'periode_garde_fin' => 'date',
    ];

    /**
     * Relation avec l'utilisateur qui gère cette structure (l'administrateur de la structure).
     */
    public function gestionnaire(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur', 'id_utilisateur');
    }

    /**
     * Relation Many-to-Many avec les services.
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'structure_services', 'id_structure', 'id_service')
                    ->withPivot('disponibilite', 'informations_supplementaires')
                    ->withTimestamps();
    }

    /**
     * Relation Many-to-Many avec les produits via le stock.
     */
    public function produitsEnStock(): BelongsToMany
    {
        return $this->belongsToMany(Produit::class, 'stock_produits', 'id_structure', 'id_produit')
                    ->withPivot('quantite_disponible', 'statut_stock')
                    ->withTimestamps();
    }

    /**
     * Relation Many-to-Many avec les compagnies d'assurance.
     */
    public function assurances(): BelongsToMany
    {
        return $this->belongsToMany(CompagnieAssurance::class, 'structure_assurances', 'id_structure', 'id_assurance')
                    ->withPivot('modalites_specifiques')
                    ->withTimestamps();
    }

    /**
     * Relation One-to-Many avec les évaluations.
     */
    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class, 'id_structure', 'id_structure');
    }
}
