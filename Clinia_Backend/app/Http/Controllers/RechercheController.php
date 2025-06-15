<?php

namespace App\Http\Controllers;

use App\Models\Recherche; // Assurez-vous que le nom de votre modèle est bien 'Recherche' (au singulier)
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; // Assurez-vous que cette ligne est présente et correcte

/**
 * @group Historique des Recherches
 *
 * Ces APIs permettent aux utilisateurs de gérer leur historique de recherches et aux administrateurs de consulter toutes les recherches.
 */
class RechercheController extends Controller
{
    /**
     * Affiche l'historique des recherches pour l'utilisateur connecté.
     *
     * Cet endpoint retourne la liste de toutes les recherches effectuées par l'utilisateur authentifié,
     * triées par la plus récente en premier.
     *
     * @authenticated
     * @response {
     * "status": true,
     * "recherches": [
     * {
     * "id_recherche": 1,
     * "id_utilisateur": 1,
     * "terme_recherche": "clinique dentaire",
     * "resultats_json": "{}",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:00:00.000000Z"
     * },
     * {
     * "id_recherche": 2,
     * "id_utilisateur": 1,
     * "terme_recherche": "pharmacie nuit Cotonou",
     * "resultats_json": "{}",
     * "created_at": "2023-10-27T10:05:00.000000Z",
     * "updated_at": "2023-10-27T10:05:00.000000Z"
     * }
     * ]
     * }
     * @response 200 {
     * "status": true,
     * "recherches": []
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour voir l'historique de vos recherches."
     * }
     */
    public function index()
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Vous devez être authentifié pour voir l\'historique de vos recherches.',
            ], 401);
        }

        $recherches = Auth::user()->recherches()->orderByDesc('created_at')->get();

        return response()->json([
            'status' => true,
            'recherches' => $recherches,
        ], 200);
    }

    /**
     * Supprime une recherche de l'historique de l'utilisateur connecté.
     *
     * Cet endpoint permet à un utilisateur authentifié de supprimer une de ses recherches
     * de son historique. La suppression est irréversible.
     *
     * @authenticated
     * @urlParam id_recherche int required L'ID unique de la recherche à supprimer. Example: 1
     * @response 200 {
     * "status": true,
     * "message": "Recherche supprimée de l'historique avec succès."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour supprimer l'historique de vos recherches."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Recherche non trouvée ou vous n'êtes pas autorisé à la supprimer."
     * }
     */
    public function destroy($id_recherche)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Vous devez être authentifié pour supprimer l\'historique de vos recherches.',
            ], 401);
        }

        $recherche = Recherche::where('id_recherche', $id_recherche)
                              ->where('id_utilisateur', Auth::user()->id_utilisateur)
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
            'message' => 'Recherche supprimée de l'historique avec succès.',
        ], 200);
    }

    /**
     * Affiche toutes les recherches (pour le tableau de bord administrateur).
     *
     * Cet endpoint est réservé aux administrateurs et permet de visualiser toutes les recherches effectuées
     * sur la plateforme, quel que soit l'utilisateur. Les recherches sont retournées avec les informations
     * de l'utilisateur qui les a effectuées.
     *
     * @authenticated
     * @response {
     * "status": true,
     * "recherches": [
     * {
     * "id_recherche": 1,
     * "id_utilisateur": 1,
     * "terme_recherche": "clinique pédiatrique",
     * "resultats_json": "{\"count\": 5, \"matches\": [{\"id\": 10, \"name\": \"Clinique Sainte Marie\"}]}",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:00:00.000000Z",
     * "utilisateur": {
     * "id_utilisateur": 1,
     * "nom": "Doe",
     * "prenom": "Jane"
     * }
     * }
     * ]
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas administrateur."
     * }
     */
    public function adminIndex()
    {
        $recherches = Recherche::with('utilisateur')->orderByDesc('created_at')->get();
        return response()->json([
            'status' => true,
            'recherches' => $recherches,
        ], 200);
    }
}
