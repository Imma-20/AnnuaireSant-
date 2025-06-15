<?php

namespace App\Http\Controllers;

use App\Models\StockProduit;
use App\Models\StructureSante; // Pour vérifier l'accès du gestionnaire de structure
use App\Models\Produit;        // Pour valider l'existence du produit
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; // Assurez-vous que cette ligne est présente et correcte

/**
 * @group Gestion du Stock de Produits des Structures de Santé
 *
 * Ces APIs permettent de gérer l'inventaire des produits au sein des structures de santé.
 * Elles sont accessibles aux administrateurs (pour toutes les structures) et aux gestionnaires de structures (pour leur propre structure).
 */
class StockProduitController extends Controller
{
    /**
     * Affiche les produits en stock pour une structure spécifique.
     *
     * Cet endpoint est accessible à tous les utilisateurs et retourne la liste des produits
     * en stock pour une structure de santé donnée, à condition qu'elle soit vérifiée.
     * Les informations pivot comme la `quantite_disponible` et le `statut_stock` sont incluses.
     *
     * @urlParam id_structure int required L'ID unique de la structure de santé. Example: 1
     * @response {
     * "status": true,
     * "produits_en_stock": [
     * {
     * "id_produit": 1,
     * "nom_produit": "Paracétamol 500mg",
     * "description": "Médicament pour la douleur.",
     * "categorie": "Médicament",
     * "code_produit": "PARA500",
     * "pivot": {
     * "id_structure": 1,
     * "id_produit": 1,
     * "quantite_disponible": 150,
     * "statut_stock": "disponible"
     * }
     * },
     * {
     * "id_produit": 2,
     * "nom_produit": "Gants stériles",
     * "description": "Gants médicaux.",
     * "categorie": "Matériel Médical",
     * "code_produit": "GANT001",
     * "pivot": {
     * "id_structure": 1,
     * "id_produit": 2,
     * "quantite_disponible": 20,
     * "statut_stock": "stock_critique"
     * }
     * }
     * ]
     * }
     * @response 200 {
     * "status": true,
     * "produits_en_stock": []
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

        // Récupère les produits en stock via la relation many-to-many avec les attributs pivot
        $stockItems = $structure->produitsEnStock()->withPivot('quantite_disponible', 'statut_stock')->get();

        return response()->json([
            'status' => true,
            'produits_en_stock' => $stockItems,
        ], 200);
    }

    /**
     * Ajoute ou met à jour un produit en stock pour une structure de santé.
     *
     * Cet endpoint permet d'ajouter un nouveau produit à l'inventaire d'une structure ou de mettre à jour
     * la quantité et le statut d'un produit déjà en stock.
     * Accessible aux administrateurs (pour toute structure) ou au gestionnaire de la structure concernée.
     *
     * @authenticated
     * @urlParam id_structure int required L'ID unique de la structure de santé dont le stock est géré. Example: 1
     * @bodyParam id_produit int required L'ID unique du produit à ajouter ou mettre à jour dans le stock. Doit exister dans la table `produits`. Example: 1
     * @bodyParam quantite_disponible int required La quantité disponible du produit. Doit être un entier non négatif. Example: 100
     * @bodyParam statut_stock string Le statut actuel du stock. Peut être `disponible`, `stock_critique`, ou `indisponible`. Par défaut: `disponible`. Example: disponible
     *
     * @response 200 {
     * "status": true,
     * "message": "Stock du produit mis à jour avec succès.",
     * "stock_item": {
     * "id_structure": 1,
     * "id_produit": 1,
     * "quantite_disponible": 100,
     * "statut_stock": "disponible",
     * "created_at": "2023-10-27T10:00:00Z",
     * "updated_at": "2023-10-27T10:30:00Z"
     * }
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "id_produit": ["Le champ id produit est requis."],
     * "quantite_disponible": ["Le champ quantite disponible doit être un entier."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour gérer le stock."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à gérer le stock de cette structure."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée."
     * }
     */
    public function storeOrUpdate(Request $request, $id_structure)
    {
        // L'appel à auth()->user() est fait ici.
        // Si l'utilisateur n'est pas authentifié par le middleware 'auth:sanctum', 'auth()->user()' sera null.
        // C'est pourquoi la route doit IMPÉRATIVEMENT être protégée.
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
                'message' => 'Accès refusé. Vous n\'êtes pas autorisé à gérer le stock de cette structure.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'id_produit' => 'required|exists:produits,id_produit',
            'quantite_disponible' => 'required|integer|min:0',
            'statut_stock' => 'nullable|in:disponible,stock_critique,indisponible',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        // `syncWithoutDetaching` va attacher si non existant, ou mettre à jour si existant
        // La clé est id_produit pour la relation `produitsEnStock`
        $structure->produitsEnStock()->syncWithoutDetaching([
            $request->id_produit => [
                'quantite_disponible' => $request->quantite_disponible,
                'statut_stock' => $request->statut_stock ?? 'disponible',
                'updated_at' => now(), // Assurer que updated_at est mis à jour
            ]
        ]);

        $stockItem = StockProduit::where('id_structure', $id_structure)
                                  ->where('id_produit', $request->id_produit)
                                  ->first();

        return response()->json([
            'status' => true,
            'message' => 'Stock du produit mis à jour avec succès.',
            'stock_item' => $stockItem,
        ], 200);
    }

    /**
     * Supprime un produit du stock d'une structure de santé.
     *
     * Cet endpoint permet de retirer un produit de l'inventaire d'une structure de santé.
     * Le produit n'est pas supprimé de la table `produits`, seule son association avec la structure est retirée.
     * Accessible aux administrateurs (pour toute structure) ou au gestionnaire de la structure concernée.
     *
     * @authenticated
     * @urlParam id_structure int required L'ID unique de la structure de santé. Example: 1
     * @urlParam id_produit int required L'ID unique du produit à supprimer du stock. Example: 1
     *
     * @response 200 {
     * "status": true,
     * "message": "Produit retiré du stock de la structure avec succès."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour supprimer des produits du stock."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à supprimer des produits de cette structure."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée."
     * }
     */
    public function destroy($id_structure, $id_produit)
    {
        $user = auth()->user();
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
                'message' => 'Accès refusé. Vous n\'êtes pas autorisé à supprimer des produits de cette structure.',
            ], 403);
        }

        // Vérifier si la relation existe
        if (!$structure->produitsEnStock()->where('id_produit', $id_produit)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'Ce produit n\'est pas en stock dans cette structure.',
            ], 404);
        }

        $structure->produitsEnStock()->detach($id_produit);

        return response()->json([
            'status' => true,
            'message' => 'Produit retiré du stock de la structure avec succès.',
        ], 200);
    }
}
