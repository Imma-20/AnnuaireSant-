<?php

namespace App\Http\Controllers;

use App\Models\CompagnieAssurance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // Pour la gestion des fichiers (logos)

/**
 * @group Gestion des Compagnies d'Assurance
 *
 * Ces APIs permettent de gérer les informations des compagnies d'assurance.
 * Elles incluent des opérations pour les administrateurs et des consultations publiques.
 */
class CompagnieAssuranceController extends Controller
{
    /**
     * Affiche une liste de toutes les compagnies d'assurance.
     *
     * Cet endpoint est accessible à tous les utilisateurs et retourne la liste complète des compagnies d'assurance enregistrées.
     *
     * @response {
     * "status": true,
     * "compagnies": [
     * {
     * "id_assurance": 1,
     * "nom_assurance": "Assurance Santé Plus",
     * "logo": "http://localhost:8000/storage/logos/assurances/logo1.png",
     * "description": "Leader de l'assurance santé.",
     * "contact": "contact@assurancesanteplus.com",
     * "site_web": "http://www.assurancesanteplus.com",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:00:00.000000Z"
     * },
     * {
     * "id_assurance": 2,
     * "nom_assurance": "Mutuelle Béninoise",
     * "logo": null,
     * "description": "Mutuelle locale pour tous.",
     * "contact": "info@mutuellebeninoise.com",
     * "site_web": "http://www.mutuellebeninoise.com",
     * "created_at": "2023-10-27T10:05:00.000000Z",
     * "updated_at": "2023-10-27T10:05:00.000000Z"
     * }
     * ]
     * }
     * @response 200 {
     * "status": true,
     * "compagnies": []
     * }
     */
    public function index()
    {
        $compagnies = CompagnieAssurance::all();
        return response()->json([
            'status' => true,
            'compagnies' => $compagnies,
        ], 200);
    }

    /**
     * Crée une nouvelle compagnie d'assurance.
     *
     * Cet endpoint permet à un administrateur d'ajouter une nouvelle compagnie d'assurance à la base de données.
     *
     * @authenticated
     * @bodyParam nom_assurance string required Le nom unique de la compagnie d'assurance (max: 255 caractères). Example: Nouvelle Assurance SA
     * @bodyParam logo file Le fichier logo de la compagnie d'assurance. Type de fichier image (jpeg, png, bmp, gif, svg, webp) et taille maximale de 2 Mo. Peut être nul.
     * @bodyParam description string Une description de la compagnie d'assurance. Peut être nulle. Example: Société spécialisée dans les assurances vie.
     * @bodyParam contact string Les informations de contact (ex: numéro de téléphone, email) de la compagnie. Peut être nul. Example: contact@nouvelleassurance.com
     * @bodyParam site_web string L'URL du site web de la compagnie. Doit être un format URL valide. Peut être nul. Example: http://www.nouvelleassurance.com
     *
     * @response 201 {
     * "status": true,
     * "message": "Compagnie d'assurance créée avec succès.",
     * "compagnie": {
     * "id_assurance": 3,
     * "nom_assurance": "Nouvelle Assurance SA",
     * "logo": "logos/assurances/new_logo.png",
     * "description": "Société spécialisée dans les assurances vie.",
     * "contact": "contact@nouvelleassurance.com",
     * "site_web": "http://www.nouvelleassurance.com",
     * "created_at": "2023-10-27T10:10:00.000000Z",
     * "updated_at": "2023-10-27T10:10:00.000000Z"
     * }
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "nom_assurance": ["Le nom de l'assurance est déjà utilisé."],
     * "site_web": ["Le champ site web doit être une URL valide."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour créer une compagnie d'assurance."
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
            'nom_assurance' => 'required|string|max:255|unique:compagnies_assurance,nom_assurance',
            'logo' => 'nullable|image|max:2048', // max 2MB
            'description' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'site_web' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $data = $request->all();
        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('logos/assurances', 'public');
        }

        $compagnie = CompagnieAssurance::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Compagnie d\'assurance créée avec succès.',
            'compagnie' => $compagnie,
        ], 201);
    }

    /**
     * Affiche une compagnie d'assurance spécifique.
     *
     * Cet endpoint permet de récupérer les détails d'une compagnie d'assurance en utilisant son ID unique.
     * Accessible à tous les utilisateurs.
     *
     * @urlParam id_assurance int required L'ID unique de la compagnie d'assurance à afficher. Example: 1
     * @response {
     * "status": true,
     * "compagnie": {
     * "id_assurance": 1,
     * "nom_assurance": "Assurance Santé Plus",
     * "logo": "http://localhost:8000/storage/logos/assurances/logo1.png",
     * "description": "Leader de l'assurance santé.",
     * "contact": "contact@assurancesanteplus.com",
     * "site_web": "http://www.assurancesanteplus.com",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:00:00.000000Z"
     * }
     * }
     * @response 404 {
     * "status": false,
     * "message": "Compagnie d'assurance non trouvée."
     * }
     */
    public function show($id_assurance)
    {
        $compagnie = CompagnieAssurance::find($id_assurance);

        if (!$compagnie) {
            return response()->json([
                'status' => false,
                'message' => 'Compagnie d\'assurance non trouvée.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'compagnie' => $compagnie,
        ], 200);
    }

    /**
     * Met à jour une compagnie d'assurance existante.
     *
     * Cet endpoint permet à un administrateur de modifier les informations d'une compagnie d'assurance.
     * Les champs non fournis dans la requête ne seront pas modifiés.
     *
     * @authenticated
     * @urlParam id_assurance int required L'ID unique de la compagnie d'assurance à mettre à jour. Example: 1
     * @bodyParam nom_assurance string Le nouveau nom de la compagnie (max: 255 caractères). Doit être unique. Example: Assurance Santé Prestige
     * @bodyParam logo file Le nouveau fichier logo de la compagnie. Peut être nul.
     * @bodyParam description string La nouvelle description de la compagnie. Peut être nulle. Example: Nouvelle description de l'assurance.
     * @bodyParam contact string Les nouvelles informations de contact. Peut être nul. Example: support@assurancesanteprestige.com
     * @bodyParam site_web string La nouvelle URL du site web. Doit être un format URL valide. Peut être nul. Example: http://www.assurancesanteprestige.com
     *
     * @response 200 {
     * "status": true,
     * "message": "Compagnie d'assurance mise à jour avec succès.",
     * "compagnie": {
     * "id_assurance": 1,
     * "nom_assurance": "Assurance Santé Prestige",
     * "logo": "logos/assurances/new_logo_prestige.png",
     * "description": "Nouvelle description de l'assurance.",
     * "contact": "support@assurancesanteprestige.com",
     * "site_web": "http://www.assurancesanteprestige.com",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "updated_at": "2023-10-27T10:15:00.000000Z"
     * }
     * }
     * @response 404 {
     * "status": false,
     * "message": "Compagnie d'assurance non trouvée."
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "nom_assurance": ["Le nom de l'assurance est déjà utilisé."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour modifier une compagnie d'assurance."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à effectuer cette action (rôle admin requis)."
     * }
     */
    public function update(Request $request, $id_assurance)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $compagnie = CompagnieAssurance::find($id_assurance);

        if (!$compagnie) {
            return response()->json([
                'status' => false,
                'message' => 'Compagnie d\'assurance non trouvée.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom_assurance' => 'sometimes|required|string|max:255|unique:compagnies_assurance,nom_assurance,' . $id_assurance . ',id_assurance',
            'logo' => 'nullable|image|max:2048', // max 2MB
            'description' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'site_web' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $data = $request->all();
        if ($request->hasFile('logo')) {
            // Supprimer l'ancien logo si existant
            if ($compagnie->logo && Storage::disk('public')->exists($compagnie->logo)) {
                Storage::disk('public')->delete($compagnie->logo);
            }
            $data['logo'] = $request->file('logo')->store('logos/assurances', 'public');
        }

        $compagnie->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Compagnie d\'assurance mise à jour avec succès.',
            'compagnie' => $compagnie,
        ], 200);
    }

    /**
     * Supprimer une compagnie d'assurance.
     *
     * Cet endpoint permet à un administrateur de supprimer définitivement une compagnie d'assurance.
     * La suppression entraînera la suppression du logo associé.
     *
     * @authenticated
     * @urlParam id_assurance int required L'ID unique de la compagnie d'assurance à supprimer. Example: 1
     *
     * @response 200 {
     * "status": true,
     * "message": "Compagnie d'assurance supprimée avec succès."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Compagnie d'assurance non trouvée."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour supprimer une compagnie d'assurance."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à effectuer cette action (rôle admin requis)."
     * }
     */
    public function destroy($id_assurance)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $compagnie = CompagnieAssurance::find($id_assurance);

        if (!$compagnie) {
            return response()->json([
                'status' => false,
                'message' => 'Compagnie d\'assurance non trouvée.',
            ], 404);
        }

        // Supprimer le logo associé
        if ($compagnie->logo && Storage::disk('public')->exists($compagnie->logo)) {
            Storage::disk('public')->delete($compagnie->logo);
        }

        $compagnie->delete();

        return response()->json([
            'status' => true,
            'message' => 'Compagnie d\'assurance supprimée avec succès.',
        ], 200);
    }
}
