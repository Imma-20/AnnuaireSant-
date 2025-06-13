<?php

namespace App\Http\Controllers;

use App\Models\StructureSante;
use App\Models\CompagnieAssurance;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // Pour la gestion des fichiers (logos)

class StructureSanteController extends Controller
{
    /**
     * Affiche une liste de toutes les structures de santé.
     * Accessible à tous.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $structures = StructureSante::with(['services', 'assurances', 'evaluations'])
            ->where('statut_verification', 'verifie') // N'afficher que les structures vérifiées
            ->get();

        return response()->json([
            'status' => true,
            'structures' => $structures,
        ], 200);
    }

    /**
     * Affiche une structure de santé spécifique.
     * Accessible à tous.
     *
     * @param  int  $id_structure
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id_structure)
    {
        $structure = StructureSante::with(['services', 'assurances', 'evaluations', 'produitsEnStock'])
            ->where('statut_verification', 'verifie')
            ->find($id_structure);

        if (!$structure) {
            return response()->json([
                'status' => false,
                'message' => 'Structure de santé non trouvée ou non vérifiée.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'structure' => $structure,
        ], 200);
    }

    /**
     * Permet à une structure de santé (son gestionnaire) de mettre à jour ses propres informations.
     * Nécessite le rôle 'health_structure' et l'authentification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id_structure
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id_structure)
    {
        $user = Auth::user(); // L'utilisateur authentifié
        if (!$user || $user->role !== 'health_structure') {
            return response()->json([
                'status' => false,
                'message' => 'Accès refusé. Vous devez être un gestionnaire de structure.',
            ], 403);
        }

        $structure = StructureSante::where('id_structure', $id_structure)
                                ->where('id_utilisateur', $user->id_utilisateur)
                                ->first();

        if (!$structure) {
            return response()->json([
                'status' => false,
                'message' => 'Structure non trouvée ou vous n\'êtes pas autorisé à la modifier.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom_structure' => 'sometimes|required|string|max:255',
            'type_structure' => 'sometimes|required|in:pharmacie,hopital,laboratoire,clinique,centre_medical,autre',
            'adresse' => 'nullable|string|max:255',
            'quartier' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:255',
            'commune' => 'nullable|string|max:255',
            'departement' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'telephone_principal' => 'nullable|string|max:20',
            'telephone_secondaire' => 'nullable|string|max:20',
            'email_contact' => 'nullable|email|unique:structures_sante,email_contact,' . $id_structure . ',id_structure',
            'site_web' => 'nullable|url|max:255',
            'horaires_ouverture' => 'nullable|json',
            'est_de_garde' => 'boolean',
            'periode_garde_debut' => 'nullable|date',
            'periode_garde_fin' => 'nullable|date|after_or_equal:periode_garde_debut',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048', // max 2MB
            'services' => 'nullable|array', // tableau d'IDs de services
            'services.*' => 'exists:services,id_service',
            'assurances' => 'nullable|array', // tableau d'IDs d'assurances
            'assurances.*' => 'exists:compagnies_assurance,id_assurance',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Gestion du logo
        if ($request->hasFile('logo')) {
            // Supprimer l'ancien logo si existant
            if ($structure->logo && Storage::disk('public')->exists($structure->logo)) {
                Storage::disk('public')->delete($structure->logo);
            }
            $path = $request->file('logo')->store('logos', 'public');
            $request->merge(['logo' => $path]); // Mettre à jour la requête avec le chemin du fichier stocké
        }

        $structure->fill($request->except(['services', 'assurances']))->save();

        // Synchronisation des services
        if ($request->has('services')) {
            $structure->services()->sync($request->services);
        }

        // Synchronisation des assurances
        if ($request->has('assurances')) {
            $structure->assurances()->sync($request->assurances);
        }

        return response()->json([
            'status' => true,
            'message' => 'Structure de santé mise à jour avec succès.',
            'structure' => $structure->load(['services', 'assurances']),
        ], 200);
    }

    /**
     * Supprime une structure de santé.
     * Accessible uniquement aux administrateurs.
     *
     * @param  int  $id_structure
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id_structure)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route

        $structure = StructureSante::find($id_structure);

        if (!$structure) {
            return response()->json([
                'status' => false,
                'message' => 'Structure de santé non trouvée.',
            ], 404);
        }

        // Supprimer le logo associé
        if ($structure->logo && Storage::disk('public')->exists($structure->logo)) {
            Storage::disk('public')->delete($structure->logo);
        }

        $structure->delete();

        return response()->json([
            'status' => true,
            'message' => 'Structure de santé supprimée avec succès.',
        ], 200);
    }

    /**
     * Recherche des structures de santé par différents critères.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $query = StructureSante::where('statut_verification', 'verifie');

        // Recherche par nom de structure ou description
        if ($request->has('keywords') && !empty($request->keywords)) {
            $keywords = $request->keywords;
            $query->where(function ($q) use ($keywords) {
                $q->where('nom_structure', 'like', '%' . $keywords . '%')
                  ->orWhere('description', 'like', '%' . $keywords . '%');
            });
        }

        // Filtrer par type de structure
        if ($request->has('type') && !empty($request->type)) {
            $query->where('type_structure', $request->type);
        }

        // Filtrer par compagnie d'assurance (via la table pivot)
        if ($request->has('assurance_id') && !empty($request->assurance_id)) {
            $assuranceId = $request->assurance_id;
            $query->whereHas('assurances', function ($q) use ($assuranceId) {
                $q->where('id_assurance', $assuranceId);
            });
        }

        // Filtrer par ville, quartier, département, commune
        if ($request->has('ville') && !empty($request->ville)) {
            $query->where('ville', 'like', '%' . $request->ville . '%');
        }
        if ($request->has('quartier') && !empty($request->quartier)) {
            $query->where('quartier', 'like', '%' . $request->quartier . '%');
        }
        if ($request->has('departement') && !empty($request->departement)) {
            $query->where('departement', 'like', '%' . $request->departement . '%');
        }
        if ($request->has('commune') && !empty($request->commune)) {
            $query->where('commune', 'like', '%' . $request->commune . '%');
        }

        // Recherche par distance (nécessite latitude et longitude du point de recherche)
        // Ceci est une implémentation simplifiée de la formule de Haversine
        if ($request->has('user_latitude') && $request->has('user_longitude') && $request->has('radius') &&
            is_numeric($request->user_latitude) && is_numeric($request->user_longitude) && is_numeric($request->radius)) {

            $userLatitude = $request->user_latitude;
            $userLongitude = $request->user_longitude;
            $radius = $request->radius; // Rayon en kilomètres

            // Calcul de distance (Haversine)
            $query->selectRaw(
                '*, ( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance',
                [$userLatitude, $userLongitude, $userLatitude]
            )
            ->having('distance', '<', $radius)
            ->orderBy('distance');
        }

        // Inclure les relations pour les résultats
        $structures = $query->with(['services', 'assurances', 'evaluations'])->get();

        // Enregistrer la recherche (pour les utilisateurs connectés)
        if (Auth::check()) {
            Auth::user()->recherches()->create([
                'termes_recherche' => $request->fullUrl(), // Ou combinez les paramètres de recherche
                'filtres_appliques' => json_encode($request->all()),
                'resultats_nombre' => $structures->count(),
                'localisation_recherche' => ($request->has('user_latitude') && $request->has('user_longitude')) ?
                                            "Lat: {$request->user_latitude}, Lng: {$request->user_longitude}" : null,
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Résultats de la recherche.',
            'structures' => $structures,
        ], 200);
    }
}
