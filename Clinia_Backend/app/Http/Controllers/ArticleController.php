<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

/**
 * @group Gestion des Articles
 *
 * APIs pour la gestion des articles de blog.
 * Ces endpoints permettent de manipuler les publications (articles) sur la plateforme.
 */
class ArticleController extends Controller
{
    /**
     * Obtenir tous les articles publiés.
     *
     * Cet endpoint récupère une liste de tous les articles qui ont le statut 'publie'.
     * Les articles en 'brouillon' ou 'archivé' ne sont pas inclus pour le public.
     * Les articles sont retournés avec les informations de leur auteur.
     *
     * @response {
     * "status": true,
     * "articles": [
     * {
     * "id_article": 1,
     * "titre": "Les Bienfaits de la Méditation",
     * "contenu": "La méditation peut réduire le stress, améliorer la concentration...",
     * "auteur_id": 1,
     * "categorie": "Bien-être",
     * "tags": ["méditation", "stress", "santé"],
     * "image_principale": "http://localhost:8000/storage/articles/images/meditation.jpg",
     * "statut": "publie",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:00:00.000000Z",
     * "auteur": {
     * "id_utilisateur": 1,
     * "nom": "Admin",
     * "prenom": "User",
     * "email": "admin@example.com"
     * }
     * }
     * ]
     * }
     * @response 200 {
     * "status": true,
     * "articles": []
     * }
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
     * Afficher un article spécifique.
     *
     * Cet endpoint permet de récupérer les détails d'un article spécifique en utilisant son ID.
     * Seuls les articles avec le statut 'publie' sont accessibles.
     * L'article est retourné avec les informations de son auteur.
     *
     * @urlParam id_article int required L'ID unique de l'article à afficher. Example: 1
     * @response {
     * "status": true,
     * "article": {
     * "id_article": 1,
     * "titre": "Les Bienfaits de la Méditation",
     * "contenu": "La méditation peut réduire le stress, améliorer la concentration...",
     * "auteur_id": 1,
     * "categorie": "Bien-être",
     * "tags": ["méditation", "stress", "santé"],
     * "image_principale": "http://localhost:8000/storage/articles/images/meditation.jpg",
     * "statut": "publie",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:00:00.000000Z",
     * "auteur": {
     * "id_utilisateur": 1,
     * "nom": "Admin",
     * "prenom": "User",
     * "email": "admin@example.com"
     * }
     * }
     * }
     * @response 404 {
     * "status": false,
     * "message": "Article non trouvé ou non publié."
     * }
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
     * Créer un nouvel article.
     *
     * Cet endpoint permet à un administrateur de créer un nouvel article de blog.
     * L'ID de l'auteur (`auteur_id`) est automatiquement défini comme l'ID de l'administrateur authentifié.
     *
     * @authenticated
     * @bodyParam titre string required Le titre de l'article (max: 255 caractères). Example: Le Futur de la Santé Numérique
     * @bodyParam contenu string required Le contenu complet de l'article (peut inclure du HTML ou du Markdown). Example: Les technologies numériques transforment le secteur de la santé...
     * @bodyParam categorie string Le nom de la catégorie de l'article. Peut être nul. Example: Technologie Médicale
     * @bodyParam tags string[] Les tags associés à l'article, fournis comme une chaîne JSON d'un tableau de chaînes. Peut être nul. Example: ["e-santé", "innovation", "IA"]
     * @bodyParam image_principale file La principale image de l'article. Type de fichier image (jpeg, png, bmp, gif, svg, webp) et taille maximale de 2 Mo. Peut être nul.
     * @bodyParam statut string required Le statut de l'article. Doit être l'une des valeurs : `brouillon`, `publie`, ou `archive`. Example: publie
     *
     * @response 201 {
     * "status": true,
     * "message": "Article créé avec succès.",
     * "article": {
     * "id_article": 1,
     * "titre": "Le Futur de la Santé Numérique",
     * "contenu": "Les technologies numériques transforment le secteur de la santé...",
     * "auteur_id": 1,
     * "categorie": "Technologie Médicale",
     * "tags": ["e-santé", "innovation", "IA"],
     * "image_principale": "articles/images/futur_sante_numerique.jpg",
     * "statut": "publie",
     * "created_at": "2023-10-27T10:30:00.000000Z",
     * "updated_at": "2023-10-27T10:30:00.000000Z"
     * }
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "titre": ["Le champ titre est requis."],
     * "email": ["L'adresse email est déjà utilisée."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour créer un article."
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
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Non authentifié. Vous devez être connecté pour créer un article.',
            ], 401);
        }

        // Si l'utilisateur est authentifié, on peut accéder à ses informations en toute sécurité
        $data = $request->all();
        $data['auteur_id'] = Auth::user()->id_utilisateur;

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
     * Mettre à jour un article existant.
     *
     * Cet endpoint permet à un administrateur de modifier les détails d'un article existant.
     * Les champs non fournis ne seront pas modifiés.
     * Nécessite une authentification avec le rôle 'admin'.
     *
     * @authenticated
     * @urlParam id_article int required L'ID unique de l'article à mettre à jour. Example: 1
     * @bodyParam titre string Le nouveau titre de l'article. Max: 255 caractères. Example: Article Mis à Jour
     * @bodyParam contenu string Le nouveau contenu de l'article. Peut être nul. Example: Ce contenu a été révisé.
     * @bodyParam categorie string La nouvelle catégorie de l'article. Peut être nul. Example: Nouveautés
     * @bodyParam tags string[] Les nouveaux tags, au format JSON string. Peut être nul. Example: ["mise à jour", "révision"]
     * @bodyParam image_principale file La nouvelle image principale de l'article. Peut être nul.
     * @bodyParam statut string Le nouveau statut de l'article. Doit être `brouillon`, `publie`, ou `archive`. Example: archive
     *
     * @response 200 {
     * "status": true,
     * "message": "Article mis à jour avec succès.",
     * "article": {
     * "id_article": 1,
     * "titre": "Article Mis à Jour",
     * "contenu": "Ce contenu a été révisé.",
     * "auteur_id": 1,
     * "categorie": "Nouveautés",
     * "tags": ["mise à jour", "révision"],
     * "image_principale": "articles/images/nouvelle_image.jpg",
     * "statut": "archive",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T11:00:00.000000Z"
     * }
     * }
     * @response 404 {
     * "status": false,
     * "message": "Article non trouvé."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour modifier un article."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à effectuer cette action (rôle admin requis)."
     * }
     * @response 422 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "statut": ["Le statut fourni est invalide."]
     * }
     * }
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
     * Supprimer un article.
     *
     * Cet endpoint permet à un administrateur de supprimer un article de la base de données.
     * La suppression est irréversible.
     * Nécessite une authentification avec le rôle 'admin'.
     *
     * @authenticated
     * @urlParam id_article int required L'ID unique de l'article à supprimer. Example: 1
     *
     * @response 200 {
     * "status": true,
     * "message": "Article supprimé avec succès."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Article non trouvé."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour supprimer un article."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à effectuer cette action (rôle admin requis)."
     * }
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
     * Obtenir tous les articles (pour l'administration).
     *
     * Cet endpoint est réservé aux administrateurs et permet de visualiser
     * tous les articles, quel que soit leur statut (`brouillon`, `publie`, `archive`).
     * L'article est retourné avec les informations de son auteur.
     * Nécessite une authentification avec le rôle 'admin'.
     *
     * @authenticated
     * @response {
     * "status": true,
     * "articles": [
     * {
     * "id_article": 1,
     * "titre": "Article en Brouillon",
     * "contenu": "...",
     * "auteur_id": 1,
     * "categorie": "Tests",
     * "tags": ["brouillon"],
     * "image_principale": null,
     * "statut": "brouillon",
     * "created_at": "2023-10-27T09:00:00.000000Z",
     * "updated_at": "2023-10-27T09:00:00.000000Z",
     * "auteur": {
     * "id_utilisateur": 1,
     * "nom": "Admin",
     * "prenom": "User",
     * "email": "admin@example.com"
     * }
     * },
     * {
     * "id_article": 2,
     * "titre": "Article Publié",
     * "contenu": "...",
     * "auteur_id": 1,
     * "categorie": "Actualités",
     * "tags": ["publié"],
     * "image_principale": "articles/images/image_publie.jpg",
     * "statut": "publie",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:00:00.000000Z",
     * "auteur": {
     * "id_utilisateur": 1,
     * "nom": "Admin",
     * "prenom": "User",
     * "email": "admin@example.com"
     * }
     * }
     * ]
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas administrateur."
     * }
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
