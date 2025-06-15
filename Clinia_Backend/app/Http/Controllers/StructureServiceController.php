<?php

namespace App\Http\Controllers;

use App\Models\StructureService;
use App\Models\StructureSante; // Pour vérifier l'accès du gestionnaire de structure
use App\Models\Service;        // Pour valider l'existence du service
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; // Nécessaire pour Auth::user()

/**
 * @group Gestion des Services des Structures de Santé
 *
 * Ces APIs permettent de gérer les services offerts par les structures de santé.
 * Elles incluent la consultation des services d'une structure, l'ajout, la mise à jour et la suppression de ces associations.
 */
class StructureServiceController extends Controller
{
    /**
     * Affiche les services associés à une structure spécifique.
     *
     * Cet endpoint est accessible à tous et retourne la liste des services
     * associés à une structure de santé donnée, à condition qu'elle soit vérifiée.
     * Les informations pivot comme la `disponibilite` et les `informations_supplementaires` sont incluses.
     *
     * @urlParam id_structure int required L'ID unique de la structure de santé. Example: 1
     * @response {
     * "status": true,
     * "services_de_la_structure": [
     * {
     * "id_service": 1,
     * "nom_service": "Consultation Générale",
     * "description": "Consultation médicale de base.",
     * "categorie": "Consultation",
     * "pivot": {
     * "id_structure": 1,
     * "id_service": 1,
     * "disponibilite": "disponible",
     * "informations_supplementaires": "Pas de rendez-vous nécessaire."
     * }
     * }
     * ]
     * }
     * @response 200 {
     * "status": true,
     * "services_de_la_structure": []
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée ou non vérifiée."
     * }
     */
    public function indexByStructure($id_structure)
    {
        $structure = StructureSante::where('id_structure', $id_structure)
                                ->where('statut_verification', 'verifie')
                                ->first();

        if (!$structure) {
            return response()->json([
                'status' => false,
                'message' => 'Structure de santé non trouvée ou non vérifiée.',
            ], 404);
        }

        // Récupère les services via la relation many-to-many avec les attributs pivot
        $services = $structure->services()->withPivot('disponibilite', 'informations_supplementaires')->get();

        return response()->json([
            'status' => true,
            'services_de_la_structure' => $services,
        ], 200);
    }

    /**
     * Associe un service à une structure de santé.
     *
     * Cet endpoint permet d'associer un service existant à une structure de santé,
     * en spécifiant sa disponibilité et des informations supplémentaires.
     * Accessible aux administrateurs (pour toute structure) ou au gestionnaire de la structure concernée.
     *
     * @authenticated
     * @urlParam id_structure int required L'ID unique de la structure de santé. Example: 1
     * @bodyParam id_service int required L'ID unique du service à associer. Doit exister. Example: 1
     * @bodyParam disponibilite string La disponibilité du service. Valeurs possibles: `disponible`, `indisponible`, `sur_rendez_vous`. Par défaut: `disponible`. Example: sur_rendez_vous
     * @bodyParam informations_supplementaires string Informations additionnelles sur le service (max: 1000 caractères). Peut être nul. Example: Veuillez prendre rendez-vous 24h à l'avance.
     *
     * @response 201 {
     * "status": true,
     * "message": "Service associé à la structure avec succès.",
     * "structure_service": {
     * "id_structure": 1,
     * "id_service": 1,
     * "disponibilite": "sur_rendez_vous",
     * "informations_supplementaires": "Veuillez prendre rendez-vous 24h à l'avance."
     * }
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "id_service": ["Le champ id service est requis."],
     * "disponibilite": ["La valeur sélectionnée pour disponibilite est invalide."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour associer un service."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à ajouter des services à cette structure."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée."
     * }
     * @response 409 {
     * "status": false,
     * "message": "Ce service est déjà associé à cette structure."
     * }
     */
    public function store(Request $request, $id_structure)
    {
        $user = Auth::user();
        $structure = StructureSante::find($id_structure);

        if (!$structure) {
            return response()->json([
                'status' => false,
                'message' => 'Structure de santé non trouvée.',
            ], 404);
        }

        // Vérification d'autorisation: admin OU gestionnaire de cette structure
        if (!$user || ($user->role !== 'admin' && ($user->role !== 'health_structure' || $structure->id_utilisateur !== $user->id_utilisateur))) {
            return response()->json([
                'status' => false,
                'message' => 'Accès refusé. Vous n\'êtes pas autorisé à ajouter des services à cette structure.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'id_service' => 'required|exists:services,id_service',
            'disponibilite' => 'nullable|in:disponible,indisponible,sur_rendez_vous',
            'informations_supplementaires' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Vérifier si la relation existe déjà
        if ($structure->services()->where('id_service', $request->id_service)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'Ce service est déjà associé à cette structure.',
            ], 409); // 409 Conflict
        }

        // Attacher le service avec les données pivot
        $structure->services()->attach($request->id_service, [
            'disponibilite' => $request->disponibilite ?? 'disponible',
            'informations_supplementaires' => $request->informations_supplementaires,
            'created_at' => now(), // Laravel ne les ajoute pas par défaut pour attach()
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Service associé à la structure avec succès.',
            'structure_service' => [
                'id_structure' => $id_structure,
                'id_service' => $request->id_service,
                'disponibilite' => $request->disponibilite ?? 'disponible',
                'informations_supplementaires' => $request->informations_supplementaires,
            ]
        ], 201);
    }

    /**
     * Met à jour les informations d'un service associé à une structure.
     *
     * Cet endpoint permet de modifier la disponibilité et les informations supplémentaires
     * d'une association existante entre une structure de santé et un service.
     * Accessible aux administrateurs (pour toute structure) ou au gestionnaire de la structure concernée.
     *
     * @authenticated
     * @urlParam id_structure int required L'ID unique de la structure de santé. Example: 1
     * @urlParam id_service int required L'ID unique du service associé. Example: 1
     * @bodyParam disponibilite string La nouvelle disponibilité du service. Valeurs possibles: `disponible`, `indisponible`, `sur_rendez_vous`. Peut être omis. Example: disponible
     * @bodyParam informations_supplementaires string Les nouvelles informations additionnelles. Peut être nul (max: 1000 caractères). Example: Service désormais disponible sans rendez-vous.
     *
     * @response 200 {
     * "status": true,
     * "message": "Informations du service mises à jour avec succès pour la structure.",
     * "structure_service": {
     * "id_structure": 1,
     * "id_service": 1,
     * "disponibilite": "disponible",
     * "informations_supplementaires": "Service désormais disponible sans rendez-vous.",
     * "created_at": "2023-10-27T10:00:00Z",
     * "updated_at": "2023-10-27T10:45:00Z"
     * }
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "disponibilite": ["La valeur sélectionnée pour disponibilite est invalide."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour modifier les services."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à modifier les services de cette structure."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée ou service non associé."
     * }
     */
    public function update(Request $request, $id_structure, $id_service)
    {
        $user = Auth::user();
        $structure = StructureSante::find($id_structure);

        if (!$structure) {
            return response()->json([
                'status' => false,
                'message' => 'Structure de santé non trouvée.',
            ], 404);
        }

        // Vérification d'autorisation: admin OU gestionnaire de cette structure
        if (!$user || ($user->role !== 'admin' && ($user->role !== 'health_structure' || $structure->id_utilisateur !== $user->id_utilisateur))) {
            return response()->json([
                'status' => false,
                'message' => 'Accès refusé. Vous n\'êtes pas autorisé à modifier les services de cette structure.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'disponibilite' => 'nullable|in:disponible,indisponible,sur_rendez_vous',
            'informations_supplementaires' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Vérifier si la relation existe
        if (!$structure->services()->where('id_service', $id_service)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'Ce service n\'est pas associé à cette structure.',
            ], 404);
        }

        // Mettre à jour les données pivot
        $structure->services()->updateExistingPivot($id_service, [
            'disponibilite' => $request->disponibilite,
            'informations_supplementaires' => $request->informations_supplementaires,
            'updated_at' => now(),
        ]);

        // Recharger le service pour obtenir les données pivot mises à jour
        $updatedService = $structure->services()->where('id_service', $id_service)->first();

        return response()->json([
            'status' => true,
            'message' => 'Informations du service mises à jour avec succès pour la structure.',
            'structure_service' => $updatedService->pivot, // Retourne les données de la table pivot
        ], 200);
    }

    /**
     * Dissocie un service d'une structure de santé.
     *
     * Cet endpoint permet de retirer une association existante entre une structure de santé et un service.
     * Le service lui-même n'est pas supprimé de la base de données.
     * Accessible aux administrateurs (pour toute structure) ou au gestionnaire de la structure concernée.
     *
     * @authenticated
     * @urlParam id_structure int required L'ID unique de la structure de santé. Example: 1
     * @urlParam id_service int required L'ID unique du service à dissocier. Example: 1
     *
     * @response 200 {
     * "status": true,
     * "message": "Service dissocié de la structure avec succès."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour supprimer un service."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à supprimer les services de cette structure."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée ou service non associé."
     * }
     */
    public function destroy($id_structure, $id_service)
    {
        $user = Auth::user();
        $structure = StructureSante::find($id_structure);

        if (!$structure) {
            return response()->json([
                'status' => false,
                'message' => 'Structure de santé non trouvée.',
            ], 404);
        }

        // Vérification d'autorisation: admin OU gestionnaire de cette structure
        if (!$user || ($user->role !== 'admin' && ($user->role !== 'health_structure' || $structure->id_utilisateur !== $user->id_utilisateur))) {
            return response()->json([
                'status' => false,
                'message' => 'Accès refusé. Vous n\'êtes pas autorisé à supprimer les services de cette structure.',
            ], 403);
        }

        // Vérifier si la relation existe
        if (!$structure->services()->where('id_service', $id_service)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'Ce service n\'est pas associé à cette structure.',
            ], 404);
        }

        $structure->services()->detach($id_service);

        return response()->json([
            'status' => true,
            'message' => 'Service dissocié de la structure avec succès.',
        ], 200);
    }
}
