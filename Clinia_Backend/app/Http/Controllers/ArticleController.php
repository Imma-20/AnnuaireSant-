<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth; // Ajout pour une meilleure clarté, bien que auth() suffise

class ArticleController extends Controller
{
    /**
     * Affiche une liste de tous les articles.
     * Accessible à tous.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // N'afficher que les articles publiés pour les utilisateurs normaux
        $articles = Article::where('statut', 'publie')->with('auteur')->get();
        return response()->json([
            'status' => true,
            'articles' => $articles,
        ], 200);
    }

    /**
     * Affiche un article spécifique.
     * Accessible à tous.
     *
     * @param  int  $id_article
     * @return \Illuminate->Http->JsonResponse
     */
    public function show($id_article)
    {
        $article = Article::where('statut', 'publie')->with('auteur')->find($id_article);

        if (!$article) {
            return response()->json([
                'status' => false,
                'message' => 'Article non trouvé ou non publié.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'article' => $article,
        ], 200);
    }

    /**
     * Crée un nouvel article.
     * Accessible uniquement aux administrateurs.
     *
     * @param  \Illuminate->Http->Request  $request
     * @return \Illuminate->Http->JsonResponse
     */
    public function store(Request $request)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'categorie' => 'nullable|string|max:255',
            'tags' => 'nullable|json',
            'image_principale' => 'nullable|image|max:2048', // max 2MB
            'statut' => 'required|in:brouillon,publie,archive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Vérification explicite de l'authentification
        // Ceci est une mesure défensive, car la route devrait déjà être protégée par 'auth:sanctum'.
        if (!Auth::check()) { // Ou !auth()->check()
            return response()->json([
                'status' => false,
                'message' => 'Non authentifié. Vous devez être connecté pour créer un article.',
            ], 401);
        }

        // Si l'utilisateur est authentifié, on peut accéder à ses informations en toute sécurité
        $data = $request->all();
        $data['auteur_id'] = Auth::user()->id_utilisateur; // Ou auth()->user()->id_utilisateur;

        if ($request->hasFile('image_principale')) {
            $data['image_principale'] = $request->file('image_principale')->store('articles/images', 'public');
        }

        $article = Article::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Article créé avec succès.',
            'article' => $article,
        ], 201);
    }

    /**
     * Met à jour un article existant.
     * Accessible uniquement aux administrateurs.
     *
     * @param  \Illuminate->Http->Request  $request
     * @param  int  $id_article
     * @return \Illuminate->Http->JsonResponse
     */
    public function update(Request $request, $id_article)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $article = Article::find($id_article);

        if (!$article) {
            return response()->json([
                'status' => false,
                'message' => 'Article non trouvé.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|required|string|max:255',
            'contenu' => 'sometimes|required|string',
            'categorie' => 'nullable|string|max:255',
            'tags' => 'nullable|json',
            'image_principale' => 'nullable|image|max:2048',
            'statut' => 'sometimes|required|in:brouillon,publie,archive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $data = $request->except(['auteur_id']); // L'auteur ne doit pas être modifié via update
        if ($request->hasFile('image_principale')) {
            // Supprimer l'ancienne image si existante
            if ($article->image_principale && Storage::disk('public')->exists($article->image_principale)) {
                Storage::disk('public')->delete($article->image_principale);
            }
            $data['image_principale'] = $request->file('image_principale')->store('articles/images', 'public');
        }

        $article->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Article mis à jour avec succès.',
            'article' => $article,
        ], 200);
    }

    /**
     * Supprime un article.
     * Accessible uniquement aux administrateurs.
     *
     * @param  int  $id_article
     * @return \Illuminate->Http->JsonResponse
     */
    public function destroy($id_article)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $article = Article::find($id_article);

        if (!$article) {
            return response()->json([
                'status' => false,
                'message' => 'Article non trouvé.',
            ], 404);
        }

        // Supprimer l'image associée
        if ($article->image_principale && Storage::disk('public')->exists($article->image_principale)) {
            Storage::disk('public')->delete($article->image_principale);
        }

        $article->delete();

        return response()->json([
            'status' => true,
            'message' => 'Article supprimé avec succès.',
        ], 200);
    }

    /**
     * Affiche tous les articles (y compris brouillons et archivés) pour l'admin.
     * Accessible uniquement aux administrateurs.
     *
     * @return \Illuminate->Http->JsonResponse
     */
    public function adminIndex()
    {
        $articles = Article::with('auteur')->get(); // L'admin peut voir tous les statuts
        return response()->json([
            'status' => true,
            'articles' => $articles,
        ], 200);
    }
}
