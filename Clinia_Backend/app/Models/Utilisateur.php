<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Utilisateur extends Authenticatable 
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'utilisateurs';
    protected $primaryKey = 'id_utilisateur';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'telephone',
        'date_inscription',
        'role',
        'derniere_connexion',
        'statut_compte',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'derniere_connexion' => 'datetime',
    ];

    /**
     * Un utilisateur peut avoir plusieurs recherches.
     */
    public function recherches(): HasMany
    {
        return $this->hasMany(Recherche::class, 'id_utilisateur', 'id_utilisateur');
    }

    /**
     * Un utilisateur peut avoir soumis des demandes de structures de santé.
     */
    public function submittedStructureApplications(): HasMany
    {
        return $this->hasMany(StructureApplication::class, 'id_utilisateur_soumissionnaire', 'id_utilisateur');
    }

    /**
     * Un utilisateur peut être le gestionnaire d'une ou plusieurs structures de santé.
     */
    public function managedStructures(): HasMany
    {
        return $this->hasMany(StructureSante::class, 'id_utilisateur', 'id_utilisateur');
    }

    /**
     * Un utilisateur peut avoir laissé plusieurs évaluations.
     */
    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class, 'id_utilisateur', 'id_utilisateur');
    }

    /**
     * Un utilisateur peut être l'auteur de plusieurs articles.
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class, 'auteur_id', 'id_utilisateur');
    }
}
