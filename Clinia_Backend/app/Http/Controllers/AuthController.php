<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Mail\SendEmail; // Assurez-vous que cette classe existe et est configurée


class AuthController extends Controller
{
    /**
     * Enregistre un nouvel utilisateur.
     *
     * @param  \Illuminate->Http->Request  $request
     * @return \Illuminate->Http->JsonResponse
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
            // Le rôle par défaut est défini dans la migration sur la colonne 'role' (ex: 'user')
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
     * Gère la connexion des utilisateurs et indique la redirection en fonction du rôle.
     *
     * @param  \Illuminate->Http->Request  $request
     * @return \Illuminate->Http->JsonResponse
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
     * Déconnecte l'utilisateur en invalidant ses tokens.
     * Cette route devrait être protégée par le middleware 'auth:sanctum'.
     *
     * @param  \Illuminate->Http->Request  $request
     * @return \Illuminate->Http->JsonResponse
     */
    public function logout(Request $request)
    {
        // Invalidation de tous les tokens de l'utilisateur actuel
        // 'Auth::user()' (ou 'auth()->user()') retourne l'instance de l'utilisateur authentifié
        // ou 'null' si aucun utilisateur n'est authentifié.
        $user = Auth::user();

        if ($user) {
            // Si l'utilisateur est trouvé, ses tokens sont supprimés.
            $user->tokens()->delete();
            return response()->json([
                'status' => true,
                'message' => 'Déconnexion réussie.',
            ], 200);
        }

        // Si aucun utilisateur n'est authentifié (par exemple, pas de token ou token invalide)
        return response()->json([
            'status' => false,
            'message' => 'Aucun utilisateur authentifié.',
        ], 401);
    }

    /**
     * Gère la demande de réinitialisation de mot de passe.
     *
     * @param  \Illuminate->Http->Request  $request
     * @return \Illuminate->Http->JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:utilisateurs,email',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Adresse email invalide ou non enregistrée.'], 422);
        }

        $token = Str::random(60);

        // Stockage du token dans une table dédiée (assurez-vous que 'password_resets' existe ou créez-la)
        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'created_at' => now()]
        );

        // Générer le lien de réinitialisation (ajustez l'URL de base selon votre frontend)
        $link = url(env('FRONTEND_URL', 'http://localhost:3000') . '/reset-password?token=' . $token . '&email=' . $request->email);

        // Envoyer l'email avec le lien
        // Assurez-vous que la configuration de l'envoi d'emails est correcte dans .env et config/mail.php
        Mail::to($request->email)->send(new SendEmail($link));

        return response()->json(['message' => 'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email.'], 200);
    }

    // Si vous avez besoin d'une méthode pour réinitialiser le mot de passe après avoir cliqué sur le lien
    // Ce n'est pas demandé explicitement, mais c'est la suite logique de forgotPassword.
    // public function resetPassword(Request $request)
    // {
    //     $request->validate([
    //         'token' => 'required|string',
    //         'email' => 'required|email|exists:utilisateurs,email',
    //         'password' => 'required|string|min:8|confirmed',
    //     ]);

    //     $passwordReset = DB::table('password_resets')
    //                         ->where('email', $request->email)
    //                         ->where('token', $request->token)
    //                         ->first();

    //     if (!$passwordReset || now()->diffInMinutes($passwordReset->created_at) > 60) { // Token valide pour 60 minutes
    //         return response()->json(['message' => 'Token invalide ou expiré.'], 400);
    //     }

    //     $user = Utilisateur::where('email', $request->email)->first();
    //     $user->password = Hash::make($request->password);
    //     $user->save();

    //     DB::table('password_resets')->where('email', $request->email)->delete();

    //     return response()->json(['message' => 'Votre mot de passe a été réinitialisé avec succès.'], 200);
    // }
}
