<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProduitController extends Controller
{
    /**
     * Affiche une liste de tous les produits.
     * Accessible à tous.
     *
     * @return \Illuminate\Http\JsonResponse
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
     * Accessible uniquement aux administrateurs.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
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
     * Accessible à tous.
     *
     * @param  int  $id_produit
     * @return \Illuminate\Http\JsonResponse
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
     * Accessible uniquement aux administrateurs.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id_produit
     * @return \Illuminate\Http\JsonResponse
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
     * Accessible uniquement aux administrateurs.
     *
     * @param  int  $id_produit
     * @return \Illuminate->Http->JsonResponse
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
