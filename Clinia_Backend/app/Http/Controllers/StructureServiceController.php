<?php

namespace App\Http\Controllers;

use App\Models\StructureService;
use App\Models\StructureSante; // Pour vérifier l'accès du gestionnaire de structure
use App\Models\Service;        // Pour valider l'existence du service
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StructureServiceController extends Controller
{
    /**
     * Affiche les services associés à une structure spécifique.
     * Accessible à tous.
     *
     * @param  int  $id_structure
     * @return \Illuminate->Http->JsonResponse
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
     * Accessible aux administrateurs ou au gestionnaire de la structure concernée.
     *
     * @param  \Illuminate->Http->Request  $request
     * @param  int  $id_structure
     * @return \Illuminate->Http->JsonResponse
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
        if ($user->role !== 'admin' && ($user->role !== 'health_structure' || $structure->id_utilisateur !== $user->id_utilisateur)) {
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
     * Accessible aux administrateurs ou au gestionnaire de la structure concernée.
     *
     * @param  \Illuminate->Http->Request  $request
     * @param  int  $id_structure
     * @param  int  $id_service
     * @return \Illuminate->Http->JsonResponse
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
        if ($user->role !== 'admin' && ($user->role !== 'health_structure' || $structure->id_utilisateur !== $user->id_utilisateur)) {
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
     * Accessible aux administrateurs ou au gestionnaire de la structure concernée.
     *
     * @param  int  $id_structure
     * @param  int  $id_service
     * @return \Illuminate->Http->JsonResponse
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
        if ($user->role !== 'admin' && ($user->role !== 'health_structure' || $structure->id_utilisateur !== $user->id_utilisateur)) {
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
