<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\User; // Ou Utilisateur si c'est le nom de votre modèle d'utilisateur
use App\Models\StructureSante;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    public function boot(): void
{
    // Gate pour les administrateurs
    Gate::define('manage-admin-dashboard', function (User $user) {
        return $user->role === 'admin';
    });

    // Gate pour les gestionnaires de leur propre structure
    Gate::define('manage-own-structure', function (User $user, StructureSante $structure = null) {
        // L'utilisateur doit avoir le rôle 'health_structure'
        if ($user->role !== 'health_structure') {
            return false;
        }

        // Si une structure est fournie, l'utilisateur doit être son propriétaire
        if ($structure) {
            return $user->id_utilisateur === $structure->id_utilisateur;
        }

        // Permet l'accès si c'est un gestionnaire de structure,
        // mais les contrôleurs doivent vérifier la propriété spécifique
        // pour les actions de modification/suppression.
        return true;
    });
}
}
