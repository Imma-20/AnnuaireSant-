<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Mail\SendEmail;
use Carbon\Carbon; // Importez Carbon pour gérer les dates 


/**
 * @group Authentification et Gestion des Utilisateurs
 *
 * Ces APIs gèrent l'inscription, la connexion, la déconnexion et la réinitialisation de mot de passe des utilisateurs.
 */
class AuthController extends Controller
{
    /**
     * Enregistrer un nouvel utilisateur.
     *
     * Cet endpoint permet à un nouvel utilisateur de s'inscrire sur la plateforme.
     * Un token d'authentification est généré et retourné après l'inscription réussie.
     *
     * @bodyParam nom string required Le nom de l'utilisateur. Example: Dupont
     * @bodyParam prenom string required Le prénom de l'utilisateur. Example: Jean
     * @bodyParam email string required L'adresse email unique de l'utilisateur. Doit être un format d'email valide. Example: jean.dupont@example.com
     * @bodyParam password string required Le mot de passe de l'utilisateur (minimum 8 caractères). Example: password123
     * @bodyParam password_confirmation string required La confirmation du mot de passe. Doit correspondre au champ 'password'. Example: password123
     * @bodyParam telephone string Le numéro de téléphone de l'utilisateur. Peut être nul. Example: 0601020304
     *
     * @response 201 {
     * "status": true,
     * "message": "Utilisateur enregistré avec succès.",
     * "utilisateur": {
     * "nom": "Dupont",
     * "prenom": "Jean",
     * "email": "jean.dupont@example.com",
     * "telephone": "0601020304",
     * "updated_at": "2023-10-27T10:00:00.000000Z",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "id_utilisateur": 1
     * },
     * "token": "votre-token-jwt-ici"
     * }
     * @response 400 {
     * "status": false,
     * "message": "Le champ email est requis."
     * }
     * @response 422 {
     * "message": "The given data was invalid.",
     * "errors": {
     * "email": ["The email has already been taken."],
     * "password": ["The password confirmation does not match."]
     * }
     * }
     */
    public function register(Request $request)
    {
        // Vérification des champs vides
        $fields = ['nom', 'prenom', 'email', 'password', 'telephone'];
        foreach ($fields as $field) {
            if (empty($request->$field)) {
                return response()->json([
                    'status' => false,
                    'message' => "Le champ $field est requis.",
                ], 400);
            }
        }

        // Validation Laravel
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:utilisateurs',
            'password' => 'required|string|min:8|confirmed',
            'telephone' => 'nullable|string|max:15',
        ]);

        // Vérification du format de l'email
        if (!filter_var($request->email, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'status' => false,
                'message' => 'Adresse email invalide.',
            ], 400);
        }

        // Création de l'utilisateur
        $utilisateur = Utilisateur::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telephone' => $request->telephone,
        ]);

        // Génération d'un token pour l'utilisateur
        $token = $utilisateur->createToken('authToken')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Utilisateur enregistré avec succès.',
            'utilisateur' => $utilisateur,
            'token' => $token,
        ], 201);
    }

    /**
     * Connecter un utilisateur.
     *
     * Cet endpoint permet à un utilisateur existant de se connecter en fournissant son email et son mot de passe.
     * Un token d'authentification est retourné, ainsi qu'une URL de redirection basée sur le rôle de l'utilisateur.
     *
     * @bodyParam email string required L'adresse email de l'utilisateur. Example: admin@example.com
     * @bodyParam password string required Le mot de passe de l'utilisateur. Example: password123
     *
     * @response 200 {
     * "status": true,
     * "message": "Connexion réussie.",
     * "utilisateur": {
     * "id_utilisateur": 1,
     * "nom": "Admin",
     * "prenom": "User",
     * "email": "admin@example.com",
     * "role": "admin",
     * "statut_compte": "actif"
     * },
     * "token": "votre-token-jwt-ici",
     * "redirect_to": "/admin/dashboard"
     * }
     * @response 400 {
     * "status": false,
     * "message": "Le champ email est requis."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Identifiants incorrects."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Votre compte est inactif. Veuillez contacter l'administrateur."
     * }
     * @response 422 {
     * "message": "The given data was invalid.",
     * "errors": {
     * "email": ["The email field is required."]
     * }
     * }
     */
    public function login(Request $request)
    {
        // Vérification des champs vides
        $fields = ['email', 'password'];
        foreach ($fields as $field) {
            if (empty($request->$field)) {
                return response()->json([
                    'status' => false,
                    'message' => "Le champ $field est requis.",
                ], 400);
            }
        }

        // Validation Laravel
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Vérification du format de l'email
        if (!filter_var($request->email, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'status' => false,
                'message' => 'Adresse email invalide.',
            ], 400);
        }

        // Recherche de l'utilisateur
        $utilisateur = Utilisateur::where('email', $request->email)->first();

        // Vérification des identifiants
        if (!$utilisateur || !Hash::check($request->password, $utilisateur->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Identifiants incorrects.',
            ], 401);
        }

        // Vérification du statut du compte
        if ($utilisateur->statut_compte === 'inactif') {
            return response()->json([
                'status' => false,
                'message' => 'Votre compte est inactif. Veuillez contacter l\'administrateur.',
            ], 403);
        }

        // Génération d'un token pour l'utilisateur
        $token = $utilisateur->createToken('authToken')->plainTextToken;

        // Mise à jour de la dernière connexion
        $utilisateur->update(['derniere_connexion' => now()]);

        // Détermination de l'URL de redirection basée sur le rôle
        $redirectTo = '/app/dashboard'; // URL par défaut pour les utilisateurs normaux

        switch ($utilisateur->role) {
            case 'admin':
                $redirectTo = '/admin/dashboard'; // Tableau de bord administrateur
                break;
            case 'health_structure':
                $redirectTo = '/health-structure/dashboard'; // Tableau de bord structure de santé
                break;
            case 'user':
            default:
                $redirectTo = '/app/dashboard'; // Tableau de bord de l'application (annuaire)
                break;
        }

        return response()->json([
            'status' => true,
            'message' => 'Connexion réussie.',
            'utilisateur' => $utilisateur,
            'token' => $token,
            'redirect_to' => $redirectTo, // Ajout du champ de redirection
        ], 200);
    }

    /**
     * Déconnecter l'utilisateur.
     *
     * Cet endpoint permet à l'utilisateur authentifié de se déconnecter en invalidant ses tokens API actuels.
     * L'utilisateur doit être authentifié via un token valide pour que cette opération réussisse.
     *
     * @authenticated
     * @response 200 {
     * "status": true,
     * "message": "Déconnexion réussie."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié."
     * }
     */
    public function logout(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            $user->tokens()->delete();
            return response()->json([
                'status' => true,
                'message' => 'Déconnexion réussie.',
            ], 200);
        }

        return response()->json([
            'status' => false,
            'message' => 'Aucun utilisateur authentifié.',
        ], 401);
    }

    /**
     * Demander la réinitialisation du mot de passe.
     *
     * Cet endpoint envoie un email à l'utilisateur avec un lien de réinitialisation de mot de passe.
     * L'email fourni doit correspondre à un compte existant.
     *
     * @bodyParam email string required L'adresse email de l'utilisateur dont le mot de passe doit être réinitialisé. Example: user@example.com
     *
     * @response 200 {
     * "message": "Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email."
     * }
     * @response 422 {
     * "message": "Adresse email invalide ou non enregistrée."
     * }
     */
    /**
     * Gère la demande de mot de passe oublié.
     * Génère un token, le stocke et envoie un email.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:utilisateurs,email',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Pour des raisons de sécurité, ne pas indiquer si l'email existe ou non.
            // On peut envoyer un message générique pour éviter l'énumération d'utilisateurs.
            return response()->json(['message' => 'Si cette adresse email est associée à un compte, un lien de réinitialisation vous a été envoyé.'], 200);
        }

        // Générer un token unique et sécurisé
        $token = Str::random(60);

        // Stocker ou mettre à jour le token dans la table password_resets
        // La validité du token sera vérifiée à l'étape de réinitialisation
        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'created_at' => Carbon::now()] // Utilisation de Carbon pour le timestamp
        );

        // Construire le lien de réinitialisation pour le frontend
        $link = url(env('FRONTEND_URL', 'http://localhost:3000') . '/reset-password?token=' . $token . '&email=' . $request->email);

        // Envoyer l'email
        try {
            Mail::to($request->email)->send(new SendEmail($link));
        } catch (\Exception $e) {
            // Log l'erreur d'envoi d'email
            Log::error('Erreur lors de l\'envoi de l\'email de réinitialisation: ' . $e->getMessage());
            // Même si l'envoi échoue, on renvoie un message de succès générique pour ne pas donner d'indices.
            return response()->json(['message' => 'Si cette adresse email est associée à un compte, un lien de réinitialisation vous a été envoyé.'], 200);
        }

        return response()->json(['message' => 'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email.'], 200);
    }

    /**
     * Gère la réinitialisation du mot de passe avec le token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required|string',
                'email' => 'required|email|exists:utilisateurs,email',
                'password' => 'required|string|min:8|confirmed', // 'confirmed' s'assure que password_confirmation correspond
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Retourne les erreurs de validation spécifiques
            return response()->json(['message' => 'Erreur de validation.', 'errors' => $e->errors()], 422);
        }

        // 1. Trouver le token dans la base de données
        $passwordReset = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        // 2. Vérifier si le token existe
        if (!$passwordReset) {
            return response()->json(['message' => 'Ce lien de réinitialisation de mot de passe est invalide.'], 404);
        }

        // 3. Vérifier si le token a expiré (par exemple, après 60 minutes)
        $expirationTime = Carbon::parse($passwordReset->created_at)->addMinutes(60); // Token valide 60 minutes
        if (Carbon::now()->isAfter($expirationTime)) {
            // Supprimer le token expiré pour nettoyer la base
            DB::table('password_resets')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Ce lien de réinitialisation de mot de passe a expiré. Veuillez refaire une demande.'], 400);
        }

        // 4. Trouver l'utilisateur et mettre à jour le mot de passe
        // Assurez-vous que votre modèle Utilisateur a un champ 'password'
        $user = DB::table('utilisateurs')->where('email', $request->email)->first();

        if (!$user) {
            // Cas improbable si 'exists' validation est passée, mais bonne sécurité en profondeur
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        // Mettre à jour le mot de passe de l'utilisateur
        // ATTENTION : Assurez-vous que 'utilisateurs' est le nom correct de votre table utilisateurs
        // et que 'password' est le nom correct de la colonne du mot de passe.
        DB::table('utilisateurs')
            ->where('email', $request->email)
            ->update(['password' => Hash::make($request->password)]);

        // 5. Supprimer le token après utilisation pour éviter la réutilisation
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Votre mot de passe a été réinitialisé avec succès.'], 200);
    }
}
