<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * @group Gestion des Services
 *
 * Ces APIs gèrent la création, la consultation, la modification et la suppression des services de santé.
 * Les opérations de modification et suppression sont réservées aux administrateurs.
 */
class ServiceController extends Controller
{
    /**
     * Affiche une liste de tous les services.
     *
     * Cet endpoint est accessible à tous les utilisateurs et retourne la liste complète des services de santé disponibles.
     *
     * @response {
     * "status": true,
     * "services": [
     * {
     * "id_service": 1,
     * "nom_service": "Consultation Générale",
     * "description": "Consultation médicale de base.",
     * "categorie": "Consultation",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:00:00.000000Z"
     * },
     * {
     * "id_service": 2,
     * "nom_service": "Radiologie",
     * "description": "Examens d'imagerie médicale.",
     * "categorie": "Imagerie",
     * "created_at": "2023-10-27T10:05:00.000000Z",
     * "updated_at": "2023-10-27T10:05:00.000000Z"
     * }
     * ]
     * }
     * @response 200 {
     * "status": true,
     * "services": []
     * }
     */
    public function index()
    {
        $services = Service::all();
        return response()->json([
            'status' => true,
            'services' => $services,
        ], 200);
    }

    /**
     * Crée un nouveau service.
     *
     * Cet endpoint permet à un administrateur d'ajouter un nouveau service de santé.
     * Le `nom_service` doit être unique.
     *
     * @authenticated
     * @bodyParam nom_service string required Le nom unique du service (max: 255 caractères). Example: Cardiologie
     * @bodyParam description string Une description détaillée du service. Peut être nulle. Example: Spécialité médicale dédiée aux maladies du cœur.
     * @bodyParam categorie string La catégorie du service (max: 255 caractères). Peut être nulle. Example: Spécialité
     *
     * @response 201 {
     * "status": true,
     * "message": "Service créé avec succès.",
     * "service": {
     * "id_service": 3,
     * "nom_service": "Cardiologie",
     * "description": "Spécialité médicale dédiée aux maladies du cœur.",
     * "categorie": "Spécialité",
     * "created_at": "2023-10-27T10:15:00.000000Z",
     * "updated_at": "2023-10-27T10:15:00.000000Z"
     * }
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "nom_service": ["Le champ nom service est requis."],
     * "nom_service": ["Le nom de service est déjà utilisé."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour créer un service."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à effectuer cette action (rôle admin requis)."
     * }
     */
    public function store(Request $request)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $validator = Validator::make($request->all(), [
            'nom_service' => 'required|string|max:255|unique:services,nom_service',
            'description' => 'nullable|string',
            'categorie' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $service = Service::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Service créé avec succès.',
            'service' => $service,
        ], 201);
    }

    /**
     * Affiche un service spécifique.
     *
     * Cet endpoint permet de récupérer les détails d'un service spécifique en utilisant son ID unique.
     * Accessible à tous les utilisateurs.
     *
     * @urlParam id_service int required L'ID unique du service à afficher. Example: 1
     * @response {
     * "status": true,
     * "service": {
     * "id_service": 1,
     * "nom_service": "Consultation Générale",
     * "description": "Consultation médicale de base.",
     * "categorie": "Consultation",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:00:00.000000Z"
     * }
     * }
     * @response 404 {
     * "status": false,
     * "message": "Service non trouvé."
     * }
     */
    public function show($id_service)
    {
        $service = Service::find($id_service);

        if (!$service) {
            return response()->json([
                'status' => false,
                'message' => 'Service non trouvé.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'service' => $service,
        ], 200);
    }

    /**
     * Met à jour un service existant.
     *
     * Cet endpoint permet à un administrateur de modifier les informations d'un service existant.
     * Les champs non fournis dans la requête ne seront pas modifiés.
     * Le `nom_service` doit rester unique, sauf s'il appartient au service en cours de modification.
     *
     * @authenticated
     * @urlParam id_service int required L'ID unique du service à mettre à jour. Example: 1
     * @bodyParam nom_service string Le nouveau nom du service. Max: 255 caractères. Doit être unique. Example: Médecine Générale
     * @bodyParam description string La nouvelle description du service. Peut être nulle. Example: Prise en charge des pathologies courantes.
     * @bodyParam categorie string La nouvelle catégorie du service. Peut être nulle. Example: Soins Primaires
     *
     * @response 200 {
     * "status": true,
     * "message": "Service mis à jour avec succès.",
     * "service": {
     * "id_service": 1,
     * "nom_service": "Médecine Générale",
     * "description": "Prise en charge des pathologies courantes.",
     * "categorie": "Soins Primaires",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:20:00.000000Z"
     * }
     * }
     * @response 404 {
     * "status": false,
     * "message": "Service non trouvé."
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "nom_service": ["Le nom de service est déjà utilisé par un autre service."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour modifier un service."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à effectuer cette action (rôle admin requis)."
     * }
     */
    public function update(Request $request, $id_service)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $service = Service::find($id_service);

        if (!$service) {
            return response()->json([
                'status' => false,
                'message' => 'Service non trouvé.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom_service' => 'sometimes|required|string|max:255|unique:services,nom_service,' . $id_service . ',id_service',
            'description' => 'nullable|string',
            'categorie' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $service->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Service mis à jour avec succès.',
            'service' => $service,
        ], 200);
    }

    /**
     * Supprime un service.
     *
     * Cet endpoint permet à un administrateur de supprimer définitivement un service de la base de données.
     * La suppression est irréversible.
     *
     * @authenticated
     * @urlParam id_service int required L'ID unique du service à supprimer. Example: 1
     *
     * @response 200 {
     * "status": true,
     * "message": "Service supprimé avec succès."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Service non trouvé."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour supprimer un service."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à effectuer cette action (rôle admin requis)."
     * }
     */
    public function destroy($id_service)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $service = Service::find($id_service);

        if (!$service) {
            return response()->json([
                'status' => false,
                'message' => 'Service non trouvé.',
            ], 404);
        }

        $service->delete();

        return response()->json([
            'status' => true,
            'message' => 'Service supprimé avec succès.',
        ], 200);
    }
}
