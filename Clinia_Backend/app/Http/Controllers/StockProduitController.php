<?php

namespace App\Http\Controllers;

use App\Models\StockProduit;
use App\Models\StructureSante; // Pour vérifier l'accès du gestionnaire de structure
use App\Models\Produit;        // Pour valider l'existence du produit
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; // Assurez-vous que cette ligne est présente et correcte

class StockProduitController extends Controller
{
    /**
     * Affiche les produits en stock pour une structure spécifique.
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

        // Récupère les produits en stock via la relation many-to-many avec les attributs pivot
        $stockItems = $structure->produitsEnStock()->withPivot('quantite_disponible', 'statut_stock')->get();

        return response()->json([
            'status' => true,
            'produits_en_stock' => $stockItems,
        ], 200);
    }

    /**
     * Ajoute ou met à jour un produit en stock pour une structure de santé.
     * Accessible aux administrateurs ou au gestionnaire de la structure concernée.
     *
     * @param  \Illuminate->Http->Request  $request
     * @param  int  $id_structure
     * @return \Illuminate->Http->JsonResponse
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
     * Accessible aux administrateurs ou au gestionnaire de la structure concernée.
     *
     * @param  int  $id_structure
     * @param  int  $id_produit
     * @return \Illuminate->Http->JsonResponse
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
