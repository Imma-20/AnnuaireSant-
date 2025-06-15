<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * @group Gestion des Produits
 *
 * Ces APIs gèrent la création, la consultation, la modification et la suppression des produits disponibles.
 * Les opérations de modification et suppression sont réservées aux administrateurs.
 */
class ProduitController extends Controller
{
    /**
     * Affiche une liste de tous les produits.
     *
     * Cet endpoint est accessible à tous les utilisateurs et retourne la liste complète des produits enregistrés sur la plateforme.
     *
     * @response {
     * "status": true,
     * "produits": [
     * {
     * "id_produit": 1,
     * "nom_produit": "Paracétamol 500mg",
     * "description": "Médicament pour la douleur et la fièvre.",
     * "categorie": "Médicament",
     * "code_produit": "PARA500",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:00:00.000000Z"
     * },
     * {
     * "id_produit": 2,
     * "nom_produit": "Bandage Stérile",
     * "description": "Matériel de premiers soins.",
     * "categorie": "Matériel Médical",
     * "code_produit": "BANDA001",
     * "created_at": "2023-10-27T10:05:00.000000Z",
     * "updated_at": "2023-10-27T10:05:00.000000Z"
     * }
     * ]
     * }
     * @response 200 {
     * "status": true,
     * "produits": []
     * }
     */
    public function index()
    {
        $produits = Produit::all();
        return response()->json([
            'status' => true,
            'produits' => $produits,
        ], 200);
    }

    /**
     * Crée un nouveau produit.
     *
     * Cet endpoint permet à un administrateur d'ajouter un nouveau produit à l'inventaire.
     * Le `code_produit` doit être unique s'il est fourni.
     *
     * @authenticated
     * @bodyParam nom_produit string required Le nom du produit (max: 255 caractères). Example: Aspirine 100mg
     * @bodyParam description string Une description détaillée du produit. Peut être nulle. Example: Comprimés pour soulager les maux de tête.
     * @bodyParam categorie string La catégorie du produit (max: 255 caractères). Peut être nulle. Example: Médicament
     * @bodyParam code_produit string Un code unique pour le produit (max: 255 caractères). Peut être nul. Example: ASP100
     *
     * @response 201 {
     * "status": true,
     * "message": "Produit créé avec succès.",
     * "produit": {
     * "id_produit": 3,
     * "nom_produit": "Aspirine 100mg",
     * "description": "Comprimés pour soulager les maux de tête.",
     * "categorie": "Médicament",
     * "code_produit": "ASP100",
     * "created_at": "2023-10-27T10:15:00.000000Z",
     * "updated_at": "2023-10-27T10:15:00.000000Z"
     * }
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "nom_produit": ["Le champ nom produit est requis."],
     * "code_produit": ["Le code produit est déjà utilisé."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour créer un produit."
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
            'nom_produit' => 'required|string|max:255',
            'description' => 'nullable|string',
            'categorie' => 'nullable|string|max:255',
            'code_produit' => 'nullable|string|max:255|unique:produits,code_produit',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $produit = Produit::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Produit créé avec succès.',
            'produit' => $produit,
        ], 201);
    }

    /**
     * Affiche un produit spécifique.
     *
     * Cet endpoint permet de récupérer les détails d'un produit spécifique en utilisant son ID unique.
     * Accessible à tous les utilisateurs.
     *
     * @urlParam id_produit int required L'ID unique du produit à afficher. Example: 1
     * @response {
     * "status": true,
     * "produit": {
     * "id_produit": 1,
     * "nom_produit": "Paracétamol 500mg",
     * "description": "Médicament pour la douleur et la fièvre.",
     * "categorie": "Médicament",
     * "code_produit": "PARA500",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:00:00.000000Z"
     * }
     * }
     * @response 404 {
     * "status": false,
     * "message": "Produit non trouvé."
     * }
     */
    public function show($id_produit)
    {
        $produit = Produit::find($id_produit);

        if (!$produit) {
            return response()->json([
                'status' => false,
                'message' => 'Produit non trouvé.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'produit' => $produit,
        ], 200);
    }

    /**
     * Met à jour un produit existant.
     *
     * Cet endpoint permet à un administrateur de modifier les informations d'un produit existant.
     * Les champs non fournis dans la requête ne seront pas modifiés.
     * Le `code_produit` doit rester unique, sauf s'il appartient au produit en cours de modification.
     *
     * @authenticated
     * @urlParam id_produit int required L'ID unique du produit à mettre à jour. Example: 1
     * @bodyParam nom_produit string Le nouveau nom du produit. Max: 255 caractères. Example: Paracétamol 1000mg
     * @bodyParam description string La nouvelle description du produit. Peut être nulle. Example: Traitement pour les fortes douleurs.
     * @bodyParam categorie string La nouvelle catégorie du produit. Peut être nulle. Example: Analgésique
     * @bodyParam code_produit string Le nouveau code unique du produit. Peut être nul. Example: PARA1000
     *
     * @response 200 {
     * "status": true,
     * "message": "Produit mis à jour avec succès.",
     * "produit": {
     * "id_produit": 1,
     * "nom_produit": "Paracétamol 1000mg",
     * "description": "Traitement pour les fortes douleurs.",
     * "categorie": "Analgésique",
     * "code_produit": "PARA1000",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:20:00.000000Z"
     * }
     * }
     * @response 404 {
     * "status": false,
     * "message": "Produit non trouvé."
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "code_produit": ["Le code produit est déjà utilisé par un autre produit."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour modifier un produit."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à effectuer cette action (rôle admin requis)."
     * }
     */
    public function update(Request $request, $id_produit)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $produit = Produit::find($id_produit);

        if (!$produit) {
            return response()->json([
                'status' => false,
                'message' => 'Produit non trouvé.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom_produit' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'categorie' => 'nullable|string|max:255',
            'code_produit' => 'nullable|string|max:255|unique:produits,code_produit,' . $id_produit . ',id_produit',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $produit->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Produit mis à jour avec succès.',
            'produit' => $produit,
        ], 200);
    }

    /**
     * Supprime un produit.
     *
     * Cet endpoint permet à un administrateur de supprimer définitivement un produit de la base de données.
     * La suppression est irréversible.
     *
     * @authenticated
     * @urlParam id_produit int required L'ID unique du produit à supprimer. Example: 1
     *
     * @response 200 {
     * "status": true,
     * "message": "Produit supprimé avec succès."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Produit non trouvé."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour supprimer un produit."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à effectuer cette action (rôle admin requis)."
     * }
     */
    public function destroy($id_produit)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $produit = Produit::find($id_produit);

        if (!$produit) {
            return response()->json([
                'status' => false,
                'message' => 'Produit non trouvé.',
            ], 404);
        }

        $produit->delete();

        return response()->json([
            'status' => true,
            'message' => 'Produit supprimé avec succès.',
        ], 200);
    }
}
