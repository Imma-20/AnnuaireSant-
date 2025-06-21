<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur; // Ensure this model exists and maps to your 'utilisateurs' table
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Mail\SendEmail; // Ensure this Mailable exists and is correctly configured
use Carbon\Carbon;       // Import Carbon for date handling
use Illuminate\Validation\ValidationException; // Explicitly import ValidationException
use Illuminate\Support\Facades\Log; // Import Log facade for error logging

class AuthController extends Controller
{
    /**
     * Handle user registration (for 'user' and 'health_structure' roles).
     * Administrators should be created separately or via an internal admin panel.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // 1. Unified Validation:
        // All validation rules are defined upfront.
        // 'role' is optional ('sometimes') and restricted to 'user' or 'health_structure'.
        try {
            $validatedData = $request->validate([
                'nom' => ['required', 'string', 'max:255'],
                'prenom' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:utilisateurs,email'],
                'password' => ['required', 'string', 'min:8', 'confirmed'], // 'confirmed' checks for password_confirmation
                'telephone' => ['nullable', 'string', 'max:15'], // Assuming max 15 digits for phone number
                'role' => ['sometimes', 'string', 'in:user,health_structure'], // Explicitly allowed roles
            ]);
        } catch (ValidationException $e) {
            // Return clear validation error messages on failure
            return response()->json([
                'status' => false,
                'message' => 'Erreur de validation des données d\'inscription.',
                'errors' => $e->errors(),
            ], 422); // 422 Unprocessable Entity for validation errors
        }

        // 2. Role Determination and Security Check:
        // The role is retrieved from the request, defaulting to 'user' if not specified.
        // Important security: Prevent direct registration as 'admin' via this public endpoint.
        $role = $request->input('role', 'user');

        if ($role === 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'L\'inscription en tant qu\'administrateur n\'est pas autorisée via cet endpoint public.',
            ], 403); // 403 Forbidden
        }

        // 3. User Creation:
        // Create the user using the validated data and the determined role.
        try {
            $utilisateur = Utilisateur::create([
                'nom' => $validatedData['nom'],
                'prenom' => $validatedData['prenom'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'telephone' => $validatedData['telephone'] ?? null, // Use null coalescing for nullable fields
                'role' => $role, // Assign 'user' or 'health_structure'
                'statut_compte' => 'actif', // New account is active by default
                'derniere_connexion' => null, // Initialized to null
            ]);
        } catch (\Exception $e) {
            // Catch any unexpected database or model creation errors
            Log::error('Erreur lors de la création de l\'utilisateur: ' . $e->getMessage(), ['email' => $validatedData['email']]);
            return response()->json([
                'status' => false,
                'message' => 'Une erreur est survenue lors de l\'enregistrement de l\'utilisateur. Veuillez réessayer.',
            ], 500); // 500 Internal Server Error
        }

        // 4. API Token Generation:
        // Generate a Sanctum token for the newly registered user.
        $token = $utilisateur->createToken('authToken')->plainTextToken;

        // 5. Success Response:
        // Return a secure subset of user data along with the token.
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
        ], 201); // 201 Created
    }

    /**
     * Handle user login.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // 1. Laravel Validation: More robust and standard way to handle required fields and email format.
        try {
            $request->validate([
                'email' => ['required', 'string', 'email'],
                'password' => ['required', 'string'],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Veuillez fournir une adresse email et un mot de passe valides.',
                'errors' => $e->errors(),
            ], 422);
        }

        // 2. Attempt Authentication:
        // Laravel's Auth::attempt is more secure and handles credential checking.
        // It's generally better than manually finding the user and checking the hash,
        // especially if you integrate with Laravel's session or other guards.
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => false,
                'message' => 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.',
            ], 401); // 401 Unauthorized
        }

        // Retrieve the authenticated user
        $utilisateur = $request->user(); // This gets the currently authenticated user

        // 3. Account Status Check:
        if ($utilisateur->statut_compte === 'inactif') {
            Auth::guard('web')->logout(); // Log out the user if account is inactive
            return response()->json([
                'status' => false,
                'message' => 'Votre compte est inactif. Veuillez contacter l\'administrateur.',
            ], 403); // 403 Forbidden
        }

        // 4. Generate API Token:
        // Revoke existing tokens for a cleaner session management (optional, but good for security)
        $utilisateur->tokens()->delete();
        $token = $utilisateur->createToken('authToken')->plainTextToken;

        // 5. Update last login timestamp:
        $utilisateur->update(['derniere_connexion' => Carbon::now()]);

        // 6. Determine Redirection URL based on role:
        // This is a good approach for client-side redirection.
        $redirectTo = '/app/dashboard'; // Default URL for regular users (annuaire)

        switch ($utilisateur->role) {
            case 'admin':
                $redirectTo = '/admin/dashboard'; // Administrator dashboard
                break;
            case 'health_structure':
                $redirectTo = '/health-structure/dashboard'; // Health structure dashboard
                break;
            case 'user':
            default:
                $redirectTo = '/app/dashboard'; // Regular user application dashboard
                break;
        }

        return response()->json([
            'status' => true,
            'message' => 'Connexion réussie.',
            'utilisateur' => $utilisateur, // Consider returning a limited subset of user data here for security
            'token' => $token,
            'redirect_to' => $redirectTo,
        ], 200); // 200 OK
    }

    /**
     * Handle user logout.
     * Revokes all API tokens for the authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Use Auth::user() to get the authenticated user through the API token.
        $user = Auth::user();

        if ($user) {
            // Revoke all tokens for the user, effectively logging them out from all devices/sessions
            $user->tokens()->delete();
            return response()->json([
                'status' => true,
                'message' => 'Déconnexion réussie. Tous les tokens ont été révoqués.',
            ], 200);
        }

        // This case should ideally not be hit if middleware is set up correctly,
        // but it's good for robustness.
        return response()->json([
            'status' => false,
            'message' => 'Aucun utilisateur authentifié trouvé.',
        ], 401); // 401 Unauthorized
    }

    /**
     * Handles the "forgot password" request.
     * Generates a token, stores it, and sends an email.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => ['required', 'email', 'exists:utilisateurs,email'],
            ]);
        } catch (ValidationException $e) {
            // Security Best Practice: Always send a generic success message
            // even if the email doesn't exist, to prevent user enumeration.
            Log::warning('Tentative de réinitialisation de mot de passe pour un email non existant: ' . $request->input('email'));
            return response()->json(['message' => 'Si cette adresse email est associée à un compte, un lien de réinitialisation vous a été envoyé.'], 200);
        }

        // Find the user to ensure we are working with an existing user object
        $utilisateur = Utilisateur::where('email', $request->email)->first();

        // Should not be null due to 'exists' validation, but good for type safety
        if (!$utilisateur) {
             return response()->json(['message' => 'Si cette adresse email est associée à un compte, un lien de réinitialisation vous a été envoyé.'], 200);
        }

        // Generate a unique and secure token
        $token = Str::random(60);

        // Store or update the token in the 'password_resets' table
        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'created_at' => Carbon::now()]
        );

        // Build the reset link for the frontend
        // Ensure FRONTEND_URL is set in your .env file
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173'); // Updated default to Vite's common port
        $link = url($frontendUrl . '/reset-password?token=' . $token . '&email=' . $request->email);

        // Send the email
        try {
            // Make sure the SendEmail Mailable is correctly configured (view, data, etc.)
            Mail::to($request->email)->send(new SendEmail($link));
        } catch (\Exception $e) {
            // Log the email sending error
            Log::error('Erreur lors de l\'envoi de l\'email de réinitialisation pour ' . $request->email . ': ' . $e->getMessage());
            // Maintain generic success message for security, even if email fails to send.
            return response()->json(['message' => 'Si cette adresse email est associée à un compte, un lien de réinitialisation vous a été envoyé.'], 200);
        }

        return response()->json(['message' => 'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email.'], 200);
    }

    /**
     * Handles the password reset with the token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'token' => ['required', 'string'],
                'email' => ['required', 'email', 'exists:utilisateurs,email'], // Ensure email belongs to an existing user
                'password' => ['required', 'string', 'min:8', 'confirmed'], // 'confirmed' checks that password_confirmation matches
            ]);
        } catch (ValidationException $e) {
            // Return specific validation errors
            return response()->json(['message' => 'Erreur de validation des données.', 'errors' => $e->errors()], 422);
        }

        // 1. Find the token in the database
        $passwordReset = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        // 2. Check if the token exists
        if (!$passwordReset) {
            return response()->json(['message' => 'Ce lien de réinitialisation de mot de passe est invalide ou a déjà été utilisé.'], 404); // 404 Not Found
        }

        // 3. Check if the token has expired (e.g., after 60 minutes)
        $expirationTime = Carbon::parse($passwordReset->created_at)->addMinutes(60); // Token valid for 60 minutes
        if (Carbon::now()->isAfter($expirationTime)) {
            // Delete the expired token to clean up the database
            DB::table('password_resets')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Ce lien de réinitialisation de mot de passe a expiré. Veuillez refaire une demande.'], 400); // 400 Bad Request
        }

        // 4. Find the user and update the password
        // Use the Utilisateur model for better Eloquent integration and event triggering
        $user = Utilisateur::where('email', $request->email)->first();

        if (!$user) {
            // This case should be rare due to 'exists' validation, but it's good for defensive programming
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        // Update the user's password
        $user->password = Hash::make($request->password);
        $user->save(); // Save the updated user model

        // 5. Delete the token after successful use to prevent reuse
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Votre mot de passe a été réinitialisé avec succès.'], 200);
    }
}