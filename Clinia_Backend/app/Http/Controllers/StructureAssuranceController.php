<?php

namespace App\Http\Controllers;

use App\Models\StructureAssurance;
use App\Models\StructureSante;       // Pour vérifier l'accès du gestionnaire de structure
use App\Models\CompagnieAssurance;   // Pour valider l'existence de la compagnie
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; // Nécessaire pour Auth::user()

/**
 * @group Gestion des Assurances des Structures de Santé
 *
 * Ces APIs permettent de gérer les associations entre les structures de santé et les compagnies d'assurance.
 * Elles incluent la consultation des assurances d'une structure, l'ajout, la mise à jour et la suppression de ces associations.
 */
class StructureAssuranceController extends Controller
{
    /**
     * Affiche les assurances associées à une structure spécifique.
     *
     * Cet endpoint est accessible à tous et retourne la liste des compagnies d'assurance
     * associées à une structure de santé donnée, à condition qu'elle soit vérifiée.
     * Les modalités spécifiques de l'association sont également incluses.
     *
     * @urlParam id_structure int required L'ID unique de la structure de santé. Example: 1
     * @response {
     * "status": true,
     * "assurances_de_la_structure": [
     * {
     * "id_assurance": 1,
     * "nom_assurance": "Assurance Alpha",
     * "description": "Compagnie d'assurance généraliste.",
     * "contact": "info@alpha.com",
     * "site_web": "http://www.alpha.com",
     * "pivot": {
     * "id_structure": 1,
     * "id_assurance": 1,
     * "modalites_specifiques": "Couverture à 80% pour les consultations."
     * }
     * }
     * ]
     * }
     * @response 200 {
     * "status": true,
     * "assurances_de_la_structure": []
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

        // Récupère les assurances via la relation many-to-many avec les attributs pivot
        $assurances = $structure->assurances()->withPivot('modalites_specifiques')->get();

        return response()->json([
            'status' => true,
            'assurances_de_la_structure' => $assurances,
        ], 200);
    }

    /**
     * Associe une compagnie d'assurance à une structure de santé.
     *
     * Cet endpoint permet d'associer une compagnie d'assurance existante à une structure de santé,
     * en spécifiant des modalités spécifiques pour cette association.
     * Accessible aux administrateurs (pour toute structure) ou au gestionnaire de la structure concernée.
     *
     * @authenticated
     * @urlParam id_structure int required L'ID unique de la structure de santé. Example: 1
     * @bodyParam id_assurance int required L'ID unique de la compagnie d'assurance à associer. Doit exister. Example: 1
     * @bodyParam modalites_specifiques string Les modalités ou conditions spécifiques de cette assurance pour la structure. Peut être nul (max: 1000 caractères). Example: Couverture étendue pour les urgences.
     *
     * @response 201 {
     * "status": true,
     * "message": "Compagnie d'assurance associée à la structure avec succès.",
     * "structure_assurance": {
     * "id_structure": 1,
     * "id_assurance": 1,
     * "modalites_specifiques": "Couverture étendue pour les urgences."
     * }
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "id_assurance": ["Le champ id assurance est requis."],
     * "id_assurance": ["La compagnie d'assurance sélectionnée est invalide."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour associer une assurance."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à ajouter des assurances à cette structure."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée."
     * }
     * @response 409 {
     * "status": false,
     * "message": "Cette compagnie d'assurance est déjà associée à cette structure."
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
                'message' => 'Accès refusé. Vous n\'êtes pas autorisé à ajouter des assurances à cette structure.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'id_assurance' => 'required|exists:compagnies_assurance,id_assurance',
            'modalites_specifiques' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Vérifier si la relation existe déjà
        if ($structure->assurances()->where('id_assurance', $request->id_assurance)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'Cette compagnie d\'assurance est déjà associée à cette structure.',
            ], 409); // 409 Conflict
        }

        // Attacher l'assurance avec les données pivot
        $structure->assurances()->attach($request->id_assurance, [
            'modalites_specifiques' => $request->modalites_specifiques,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Compagnie d\'assurance associée à la structure avec succès.',
            'structure_assurance' => [
                'id_structure' => $id_structure,
                'id_assurance' => $request->id_assurance,
                'modalites_specifiques' => $request->modalites_specifiques,
            ]
        ], 201);
    }

    /**
     * Met à jour les modalités d'une assurance associée à une structure.
     *
     * Cet endpoint permet de modifier les `modalites_specifiques` d'une association
     * existante entre une structure de santé et une compagnie d'assurance.
     * Accessible aux administrateurs (pour toute structure) ou au gestionnaire de la structure concernée.
     *
     * @authenticated
     * @urlParam id_structure int required L'ID unique de la structure de santé. Example: 1
     * @urlParam id_assurance int required L'ID unique de la compagnie d'assurance associée. Example: 1
     * @bodyParam modalites_specifiques string Les nouvelles modalités ou conditions spécifiques. Peut être nul (max: 1000 caractères). Example: Couverture limitée pour les nouveaux adhérents.
     *
     * @response 200 {
     * "status": true,
     * "message": "Modalités d'assurance mises à jour avec succès pour la structure.",
     * "structure_assurance": {
     * "id_structure": 1,
     * "id_assurance": 1,
     * "modalites_specifiques": "Couverture limitée pour les nouveaux adhérents.",
     * "created_at": "2023-10-27T10:00:00Z",
     * "updated_at": "2023-10-27T10:45:00Z"
     * }
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "modalites_specifiques": ["Le champ modalites specifiques ne doit pas dépasser 1000 caractères."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour modifier les assurances."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à modifier les assurances de cette structure."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée."
     * }
     */
    public function update(Request $request, $id_structure, $id_assurance)
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
                'message' => 'Accès refusé. Vous n\'êtes pas autorisé à modifier les assurances de cette structure.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'modalites_specifiques' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Vérifier si la relation existe
        if (!$structure->assurances()->where('id_assurance', $id_assurance)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'Cette compagnie d\'assurance n\'est pas associée à cette structure.',
            ], 404);
        }

        // Mettre à jour les données pivot
        $structure->assurances()->updateExistingPivot($id_assurance, [
            'modalites_specifiques' => $request->modalites_specifiques,
            'updated_at' => now(),
        ]);

        $updatedAssurance = $structure->assurances()->where('id_assurance', $id_assurance)->first();

        return response()->json([
            'status' => true,
            'message' => 'Modalités d\'assurance mises à jour avec succès pour la structure.',
            // Scribe ne peut pas déduire automatiquement le pivot complet ici, donc un exemple statique
            'structure_assurance' => [
                'id_structure' => (int) $id_structure,
                'id_assurance' => (int) $id_assurance,
                'modalites_specifiques' => $request->modalites_specifiques,
                'created_at' => '2023-10-27T10:00:00Z', // Exemple
                'updated_at' => now()->toIso8601String() // Exemple
            ],
        ], 200);
    }

    /**
     * Dissocie une compagnie d'assurance d'une structure de santé.
     *
     * Cet endpoint permet de retirer une association existante entre une structure de santé et une compagnie d'assurance.
     * La compagnie d'assurance elle-même n'est pas supprimée.
     * Accessible aux administrateurs (pour toute structure) ou au gestionnaire de la structure concernée.
     *
     * @authenticated
     * @urlParam id_structure int required L'ID unique de la structure de santé. Example: 1
     * @urlParam id_assurance int required L'ID unique de la compagnie d'assurance à dissocier. Example: 1
     *
     * @response 200 {
     * "status": true,
     * "message": "Compagnie d'assurance dissociée de la structure avec succès."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour supprimer les assurances."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à supprimer les assurances de cette structure."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée."
     * }
     */
    public function destroy($id_structure, $id_assurance)
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
                'message' => 'Accès refusé. Vous n\'êtes pas autorisé à supprimer les assurances de cette structure.',
            ], 403);
        }

        // Vérifier si la relation existe
        if (!$structure->assurances()->where('id_assurance', $id_assurance)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'Cette compagnie d\'assurance n\'est pas associée à cette structure.',
            ], 404);
        }

        $structure->assurances()->detach($id_assurance);

        return response()->json([
            'status' => true,
            'message' => 'Compagnie d\'assurance dissociée de la structure avec succès.',
        ], 200);
    }
}
