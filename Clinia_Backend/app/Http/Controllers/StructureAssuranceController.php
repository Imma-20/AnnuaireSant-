<?php

namespace App\Http\Controllers;

use App\Models\StructureAssurance;
use App\Models\StructureSante;       // Pour vérifier l'accès du gestionnaire de structure
use App\Models\CompagnieAssurance;   // Pour valider l'existence de la compagnie
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; // Nécessaire pour Auth::user()


class StructureAssuranceController extends Controller
{
    
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

    public function search(Request $request)
    {
        $query = StructureSante::with(['services', 'assurances'])
            ->where('statut_verification', 'verifie');

        // Filter by service IDs
        if ($request->filled('service_ids')) {
            $serviceIds = explode(',', $request->input('service_ids'));
            $query->whereHas('services', function ($q) use ($serviceIds) {
                $q->whereIn('id_service', $serviceIds);
            });
        }

        // Filter by structure type
        if ($request->filled('type_structure')) {
            $query->where('type_structure', $request->input('type_structure'));
        }

        // Filter by insurance company IDs
        if ($request->filled('assurance_ids')) {
            $assuranceIds = explode(',', $request->input('assurance_ids'));
            $query->whereHas('assurances', function ($q) use ($assuranceIds) {
                $q->whereIn('id_assurance', $assuranceIds);
            });
        }

        // Filter by geolocation and distance
        if ($request->filled('user_latitude') && $request->filled('user_longitude') && $request->filled('radius')) {
            $latitude = $request->input('user_latitude');
            $longitude = $request->input('user_longitude');
            $radius = $request->input('radius');

            $query->selectRaw("*, ( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance", [$latitude, $longitude, $latitude])
                  ->having("distance", "<", $radius);
        }

        $structures = $query->get();

        return response()->json([
            'status' => true,
            'structures' => $structures,
        ], 200);
    }
}
