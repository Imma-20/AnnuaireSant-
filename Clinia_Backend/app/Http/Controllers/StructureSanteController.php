<?php

namespace App\Http\Controllers;

use App\Models\StructureSante;
use App\Models\CompagnieAssurance;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // Pour la gestion des fichiers (logos)
use Illuminate\Support\Facades\Auth; // Nécessaire pour Auth::user()

/**
 * @group Gestion des Structures de Santé
 *
 * Ces APIs gèrent la consultation publique des structures de santé, ainsi que la mise à jour et la suppression (par administrateurs et gestionnaires).
 * Inclut des fonctionnalités de recherche avancée et la gestion des statuts de vérification.
 */
class StructureSanteController extends Controller
{
    /**
     * Affiche une liste de toutes les structures de santé vérifiées.
     *
     * Cet endpoint est accessible à tous les utilisateurs et retourne la liste des structures de santé
     * dont le `statut_verification` est 'verifie'. Les relations associées (services, assurances, évaluations)
     * sont automatiquement chargées.
     *
     * @response {
     * "status": true,
     * "structures": [
     * {
     * "id_structure": 1,
     * "nom_structure": "Hôpital Principal",
     * "type_structure": "hopital",
     * "adresse": "1 Rue de l'Hôpital",
     * "ville": "Cotonou",
     * "statut_verification": "verifie",
     * "services": [ { "id_service": 1, "nom_service": "Consultation", "pivot": { ... } } ],
     * "assurances": [ { "id_assurance": 1, "nom_assurance": "Assurance X", "pivot": { ... } } ],
     * "evaluations": [ { "id_evaluation": 1, "note": 4, "commentaire": "Bien", "pivot": { ... } } ]
     * }
     * ]
     * }
     * @response 200 {
     * "status": true,
     * "structures": []
     * }
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
     *
     * Cet endpoint est accessible à tous et retourne les détails complets d'une structure de santé
     * spécifique, y compris ses services, assurances, évaluations et produits en stock, à condition
     * que son `statut_verification` soit 'verifie'.
     *
     * @urlParam id_structure int required L'ID unique de la structure de santé à afficher. Example: 1
     * @response {
     * "status": true,
     * "structure": {
     * "id_structure": 1,
     * "nom_structure": "Hôpital Central de Cotonou",
     * "type_structure": "hopital",
     * "adresse": "Rue des Martyrs",
     * "ville": "Cotonou",
     * "statut_verification": "verifie",
     * "services": [ { "id_service": 1, "nom_service": "Urgence", "pivot": { ... } } ],
     * "assurances": [ { "id_assurance": 1, "nom_assurance": "Assurance Vie", "pivot": { ... } } ],
     * "evaluations": [ { "id_evaluation": 1, "note": 5, "commentaire": "Super!", "pivot": { ... } } ],
     * "produits_en_stock": [ { "id_produit": 1, "nom_produit": "Masque FFP2", "pivot": { ... } } ]
     * }
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée ou non vérifiée."
     * }
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
     *
     * Cet endpoint permet au gestionnaire d'une structure de santé (rôle `health_structure`)
     * de mettre à jour les détails de sa propre structure.
     * Les administrateurs peuvent également utiliser cet endpoint pour modifier n'importe quelle structure.
     *
     * @authenticated
     * @urlParam id_structure int required L'ID unique de la structure de santé à mettre à jour. Example: 1
     * @bodyParam nom_structure string Le nouveau nom de la structure (max: 255 caractères). Peut être omis. Example: Nouvelle Clinique ABC
     * @bodyParam type_structure string Le nouveau type de structure. Doit être une des valeurs: `pharmacie`, `hopital`, `laboratoire`, `clinique`, `centre_medical`, `autre`. Peut être omis. Example: clinique
     * @bodyParam adresse string La nouvelle adresse physique. Peut être nul. Example: 456 Avenue des Roses
     * @bodyParam quartier string Le nouveau quartier. Peut être nul. Example: Fidjrossè
     * @bodyParam ville string La nouvelle ville. Peut être nul. Example: Cotonou
     * @bodyParam commune string La nouvelle commune. Peut être nul. Example: Cotonou
     * @bodyParam departement string Le nouveau département. Peut être nul. Example: Littoral
     * @bodyParam latitude number La nouvelle latitude géographique. Entre -90 et 90. Peut être nul. Example: 6.3650
     * @bodyParam longitude number La nouvelle longitude géographique. Entre -180 et 180. Peut être nul. Example: 2.4150
     * @bodyParam telephone_principal string Le nouveau numéro de téléphone principal (max: 20 caractères). Peut être nul. Example: +22997112233
     * @bodyParam telephone_secondaire string Le nouveau numéro de téléphone secondaire (max: 20 caractères). Peut être nul. Example: +22990102030
     * @bodyParam email_contact string La nouvelle adresse email de contact. Doit être unique. Peut être nul. Example: info@nouvelleclinique.com
     * @bodyParam site_web string La nouvelle URL du site web. Doit être un format URL valide. Peut être nul. Example: http://www.nouvelleclinique.com
     * @bodyParam horaires_ouverture string Une chaîne JSON des nouveaux horaires. Peut être nul. Example: {"Lundi":"09:00-17:00", "Samedi":"09:00-12:00"}
     * @bodyParam est_de_garde boolean Indique si la structure est de garde. Example: true
     * @bodyParam periode_garde_debut date La date de début de la période de garde (format YYYY-MM-DD). Peut être nul. Example: 2024-06-15
     * @bodyParam periode_garde_fin date La date de fin de la période de garde (format YYYY-MM-DD). Doit être égale ou postérieure à `periode_garde_debut`. Peut être nul. Example: 2024-06-16
     * @bodyParam description string La nouvelle description de la structure. Peut être nul. Example: Clinique multidisciplinaire moderne avec des équipements de pointe.
     * @bodyParam logo file Le nouveau fichier logo de la structure. Type de fichier image et taille max 2 Mo. Peut être nul.
     * @bodyParam services array Un tableau d'IDs de services à synchroniser avec la structure. Les services existants non inclus seront dissociés. Example: [1, 5, 8]
     * @bodyParam services.* integer L'ID d'un service existant.
     * @bodyParam assurances array Un tableau d'IDs de compagnies d'assurance à synchroniser. Les assurances existantes non incluses seront dissociées. Example: [2, 4]
     * @bodyParam assurances.* integer L'ID d'une compagnie d'assurance existante.
     *
     * @response 200 {
     * "status": true,
     * "message": "Structure de santé mise à jour avec succès.",
     * "structure": {
     * "id_structure": 1,
     * "nom_structure": "Nouvelle Clinique ABC",
     * "email_contact": "info@nouvelleclinique.com",
     * "est_de_garde": true,
     * "services": [ { "id_service": 1, "nom_service": "Consultation" } ],
     * "assurances": [ { "id_assurance": 2, "nom_assurance": "Assurance Beta" } ]
     * }
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "email_contact": ["L'adresse email de contact est déjà utilisée."],
     * "periode_garde_fin": ["La date de fin de période de garde doit être égale ou postérieure à la date de début."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous devez être un gestionnaire de structure et gérer cette structure."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure non trouvée ou vous n'êtes pas autorisé à la modifier."
     * }
     */
    public function update(Request $request, $id_structure)
    {
        $user = Auth::user(); // L'utilisateur authentifié
        if (!$user || ($user->role !== 'health_structure' && $user->role !== 'admin')) { // Ajout vérification admin
            return response()->json([
                'status' => false,
                'message' => 'Accès refusé. Vous devez être un gestionnaire de structure ou un administrateur.',
            ], 403);
        }

        $structure = StructureSante::find($id_structure);

        if (!$structure) {
            return response()->json([
                'status' => false,
                'message' => 'Structure non trouvée.',
            ], 404);
        }

        // Si l'utilisateur n'est pas admin, il doit être le gestionnaire de cette structure
        if ($user->role !== 'admin' && $structure->id_utilisateur !== $user->id_utilisateur) {
             return response()->json([
                'status' => false,
                'message' => 'Accès refusé. Vous n\'êtes pas autorisé à modifier cette structure.',
            ], 403);
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
     *
     * Cet endpoint permet à un administrateur de supprimer définitivement une structure de santé.
     * La suppression entraînera la suppression du logo associé et de toutes les relations (services, assurances, évaluations, produits en stock).
     *
     * @authenticated
     * @urlParam id_structure int required L'ID unique de la structure de santé à supprimer. Example: 1
     *
     * @response 200 {
     * "status": true,
     * "message": "Structure de santé supprimée avec succès."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour supprimer une structure."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à effectuer cette action (rôle admin requis)."
     * }
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

        // Supprimer les relations avant de supprimer la structure
        $structure->services()->detach();
        $structure->assurances()->detach();
        $structure->evaluations()->delete(); // Ou détacher si elles peuvent exister sans structure
        $structure->produitsEnStock()->detach();

        $structure->delete();

        return response()->json([
            'status' => true,
            'message' => 'Structure de santé supprimée avec succès.',
        ], 200);
    }

    /**
     * Recherche des structures de santé par différents critères.
     *
     * Cet endpoint permet de rechercher des structures de santé vérifiées en utilisant
     * divers filtres : mots-clés (nom, description), type de structure, ID d'assurance,
     * ville, quartier, département, commune, et même la distance par rapport à une position géographique.
     * Les résultats incluent les services, assurances et évaluations associées.
     *
     * @queryParam keywords string Mots-clés pour rechercher dans le nom de la structure ou la description. Example: hôpital, laboratoire
     * @queryParam type string Filtrer par type de structure. Valeurs possibles: `pharmacie`, `hopital`, `laboratoire`, `clinique`, `centre_medical`, `autre`. Example: clinique
     * @queryParam assurance_id int Filtrer par l'ID d'une compagnie d'assurance prise en charge par la structure. Example: 1
     * @queryParam ville string Filtrer par ville. Example: Cotonou
     * @queryParam quartier string Filtrer par quartier. Example: Saint-Jean
     * @queryParam departement string Filtrer par département. Example: Atlantique
     * @queryParam commune string Filtrer par commune. Example: Abomey-Calavi
     * @queryParam user_latitude number La latitude de l'utilisateur pour la recherche par proximité. Requis si `user_longitude` et `radius` sont fournis. Example: 6.36
     * @queryParam user_longitude number La longitude de l'utilisateur pour la recherche par proximité. Requis si `user_latitude` et `radius` sont fournis. Example: 2.42
     * @queryParam radius number Le rayon de recherche en kilomètres. Requis si `user_latitude` et `user_longitude` sont fournis. Example: 10
     *
     * @response {
     * "status": true,
     * "message": "Résultats de la recherche.",
     * "structures": [
     * {
     * "id_structure": 1,
     * "nom_structure": "Pharmacie du Centre",
     * "type_structure": "pharmacie",
     * "adresse": "Rue Principale",
     * "ville": "Cotonou",
     * "distance": 0.5,
     * "services": [],
     * "assurances": [],
     * "evaluations": []
     * }
     * ]
     * }
     * @response 200 {
     * "status": true,
     * "message": "Résultats de la recherche.",
     * "structures": []
     * }
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
                'terme_recherche' => $request->fullUrl(), // Ou combinez les paramètres de recherche
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
