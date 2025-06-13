<?php

namespace App\Http\Controllers;

use App\Models\Recherche;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; // Assurez-vous que cette ligne est présente et correcte

class RechercheController extends Controller
{
    /**
     * Affiche l'historique des recherches pour l'utilisateur connecté.
     * Accessible aux utilisateurs authentifiés.
     *
     * @return \Illuminate->Http->JsonResponse
     */
    public function index()
    {
        // La méthode 'check()' de la façade Auth ou du helper auth() vérifie si un utilisateur est authentifié.
        if (!Auth::check()) { // Utilisez Auth::check() ou auth()->check()
            return response()->json([
                'status' => false,
                'message' => 'Vous devez être authentifié pour voir l\'historique de vos recherches.',
            ], 401);
        }

        // La méthode 'user()' de la façade Auth ou du helper auth() retourne l'instance de l'utilisateur authentifié.
        // Puisque la route est protégée par 'auth:sanctum', 'Auth::user()' ne devrait pas être null ici.
        $recherches = Auth::user()->recherches()->orderByDesc('created_at')->get(); // Utilisez Auth::user() ou auth()->user()

        return response()->json([
            'status' => true,
            'recherches' => $recherches,
        ], 200);
    }

    /**
     * Supprime une recherche de l'historique de l'utilisateur connecté.
     * Accessible aux utilisateurs authentifiés.
     *
     * @param  int  $id_recherche
     * @return \Illuminate->Http->JsonResponse
     */
    public function destroy($id_recherche)
    {
        if (!Auth::check()) { // Utilisez Auth::check() ou auth()->check()
            return response()->json([
                'status' => false,
                'message' => 'Vous devez être authentifié pour supprimer l\'historique de vos recherches.',
            ], 401);
        }

        $recherche = Recherche::where('id_recherche', $id_recherche)
                              ->where('id_utilisateur', Auth::user()->id_utilisateur) // Utilisez Auth::user() ou auth()->user()
                              ->first();

        if (!$recherche) {
            return response()->json([
                'status' => false,
                'message' => 'Recherche non trouvée ou vous n\'êtes pas autorisé à la supprimer.',
            ], 404);
        }

        $recherche->delete();

        return response()->json([
            'status' => true,
            'message' => 'Recherche supprimée de l\'historique avec succès.',
        ], 200);
    }

    /**
     * Affiche toutes les recherches (pour le dashboard admin).
     * Accessible uniquement aux administrateurs.
     *
     * @return \Illuminate->Http->JsonResponse
     */
    public function adminIndex()
    {
        // Cette méthode devrait être protégée par un middleware de rôle 'can:manage-admin-dashboard' sur la route.
        // Donc, Auth::user() sera valide si l'accès à cette route est permis.
        $recherches = Recherche::with('utilisateur')->orderByDesc('created_at')->get();
        return response()->json([
            'status' => true,
            'recherches' => $recherches,
        ], 200);
    }
}
