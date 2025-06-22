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
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Handle user registration (for 'user' and 'health_structure' roles).
     * This is your public registration endpoint.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nom' => ['required', 'string', 'max:255'],
                'prenom' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:utilisateurs,email'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
                'telephone' => ['nullable', 'string', 'max:20'],
                // J'ai mis 'health_structure' en plus de 'structure' car vous aviez mentionné cette valeur.
                'role' => ['sometimes', 'string', 'in:user,structure,health_structure'],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Erreur de validation des données d\'inscription.',
                'errors' => $e->errors(),
            ], 422);
        }

        // Définir le rôle par défaut si non fourni, et interdire 'admin' via cet endpoint
        $role = $validatedData['role'] ?? 'user'; // 'user' par défaut si 'role' n'est pas envoyé
        if ($role === 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'L\'inscription en tant qu\'administrateur n\'est pas autorisée via cet endpoint public.',
            ], 403);
        }

        try {
            $utilisateur = Utilisateur::create([
                'nom' => $validatedData['nom'],
                'prenom' => $validatedData['prenom'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'telephone' => $validatedData['telephone'] ?? null,
                'role' => $role,
                'date_inscription' => now(), // Utilisez now() de Carbon
                'statut_compte' => 'actif',
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de l\'utilisateur: ' . $e->getMessage(), ['email' => $validatedData['email']]);
            return response()->json([
                'status' => false,
                'message' => 'Une erreur est survenue lors de l\'enregistrement de l\'utilisateur. Veuillez réessayer.',
            ], 500);
        }

        $token = $utilisateur->createToken('authToken')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Utilisateur enregistré avec succès.',
            'utilisateur' => [
                'id_utilisateur' => $utilisateur->id_utilisateur,
                'nom' => $utilisateur->nom,
                'prenom' => $utilisateur->prenom,
                'email' => $utilisateur->email,
                'role' => $utilisateur->role,
                'statut_compte' => $utilisateur->statut_compte,
            ],
            'token' => $token,
        ], 201);
    }

    /**
     * Handle admin registration. This route should be protected or used for initial setup.
     * This method assumes you're creating a new API endpoint like /api/admin/register
     * This endpoint should NOT be publicly accessible.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function registerAdmin(Request $request)
    {
        // IMPORTANT: In a real application, this endpoint should be heavily secured.
        // - Only accessible by a super-admin.
        // - Or only callable during initial application setup (e.g., via Artisan command).
        // - NOT publicly exposed without authentication.

        try {
            $validatedData = $request->validate([
                'nom' => ['required', 'string', 'max:255'],
                'prenom' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:utilisateurs,email'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
                'telephone' => ['nullable', 'string', 'max:20'],
                // No 'role' field here, as it's fixed to 'admin'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Erreur de validation des données d\'inscription de l\'administrateur.',
                'errors' => $e->errors(),
            ], 422);
        }

        try {
            $utilisateur = Utilisateur::create([
                'nom' => $validatedData['nom'],
                'prenom' => $validatedData['prenom'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'telephone' => $validatedData['telephone'] ?? null,
                'role' => 'admin', // <-- Role is fixed to 'admin'
                'date_inscription' => now(),
                'statut_compte' => 'actif',
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de l\'administrateur: ' . $e->getMessage(), ['email' => $validatedData['email']]);
            return response()->json([
                'status' => false,
                'message' => 'Une erreur est survenue lors de l\'enregistrement de l\'administrateur. Veuillez réessayer.',
            ], 500);
        }

        $token = $utilisateur->createToken('adminAuthToken')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Administrateur enregistré avec succès.',
            'utilisateur' => [
                'id_utilisateur' => $utilisateur->id_utilisateur,
                'nom' => $utilisateur->nom,
                'prenom' => $utilisateur->prenom,
                'email' => $utilisateur->email,
                'role' => $utilisateur->role,
                'statut_compte' => $utilisateur->statut_compte,
            ],
            'token' => $token,
        ], 201);
    }


    // ... (Your login, logout, forgotPassword, resetPassword methods remain the same)
    /**
     * Connecte un utilisateur (user ou structure).
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $utilisateur = Utilisateur::where('email', $request->email)->first();

        if (!$utilisateur) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.',
            ], 401);
        }

        if (!Hash::check($request->password, $utilisateur->password)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.',
            ], 401);
        }
        
        // La logique pour refuser la connexion admin ici est redondante si vous gérez les connexions admin séparément.
        // Si vous voulez une seule route de connexion, il faut adapter cette logique.
        // Pour l'instant, je maintiens la vérification que vous aviez.
        // if ($utilisateur->role === 'admin') {
        //     return response()->json([
        //         'message' => 'Accès refusé pour les administrateurs via cette route de connexion.',
        //     ], 403);
        // }
        
        // Si vous avez une seule route de connexion pour tous les rôles, retirez le bloc ci-dessus.
        // La redirection côté frontend gérera ensuite les différents dashboards.

        Auth::login($utilisateur);

        $utilisateur->derniere_connexion = now();
        $utilisateur->save();

        $token = $utilisateur->createToken('authToken')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'utilisateur' => $utilisateur,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Déconnecte l'utilisateur.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    /**
     * Demande de réinitialisation de mot de passe (envoie l'email).
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        // Assurez-vous que la facade Password est bien importée: use Illuminate\Support\Facades\Password;
        $status = \Illuminate\Support\Facades\Password::sendResetLink($request->only('email'));

        if ($status === \Illuminate\Support\Facades\Password::RESET_LINK_SENT) {
            return response()->json(['message' => __($status)]);
        }

        return response()->json(['message' => __($status)], 500);
    }

    /**
     * Réinitialise le mot de passe.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);
        // Assurez-vous que la facade Password est bien importée: use Illuminate\Support\Facades\Password;
        $status = \Illuminate\Support\Facades\Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (Utilisateur $user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        if ($status === \Illuminate\Support\Facades\Password::PASSWORD_RESET) {
            return response()->json(['message' => __($status)]);
        }

        return response()->json(['message' => __($status)], 500);
    }
}