<?php

namespace App\Http\Controllers;

use App\Models\StructureApplication;
use App\Models\StructureSante;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage; // Pour la gestion des fichiers (logos)

class StructureApplicationController extends Controller
{
    /**
     * Soumet une nouvelle demande d'inscription de structure de santé.
     * Accessible aux utilisateurs authentifiés (rôle 'user').
     *
     * @param  \Illuminate->Http->Request  $request
     * @return \Illuminate->Http->JsonResponse
     */
    public function store(Request $request)
    {
        // L'utilisateur doit être connecté pour soumettre une structure
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Vous devez être connecté pour soumettre une structure.',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'nom_structure' => 'required|string|max:255',
            'type_structure' => 'required|in:pharmacie,hopital,laboratoire,clinique,centre_medical,autre',
            'adresse' => 'nullable|string|max:255',
            'quartier' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:255',
            'commune' => 'nullable|string|max:255',
            'departement' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'telephone_principal' => 'nullable|string|max:20',
            'telephone_secondaire' => 'nullable|string|max:20',
            'email_contact' => 'required|email|unique:structure_applications,email_contact|unique:structures_sante,email_contact|unique:utilisateurs,email',
            'site_web' => 'nullable|url|max:255',
            'horaires_ouverture' => 'nullable|json',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048', // max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation lors de la soumission de la structure.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $data = $request->all();
        $data['id_utilisateur_soumissionnaire'] = auth()->user()->id_utilisateur;
        $data['statut_demande'] = 'en_attente';

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('logos/applications', 'public');
        }

        $application = StructureApplication::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Demande d\'inscription de structure soumise avec succès. Elle est en attente d\'approbation.',
            'application' => $application,
        ], 201);
    }

    /**
     * Affiche toutes les demandes d'inscription de structure en attente.
     * Accessible uniquement aux administrateurs.
     *
     * @return \Illuminate->Http->JsonResponse
     */
    public function pendingApplications()
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $applications = StructureApplication::where('statut_demande', 'en_attente')->with('soumissionnaire')->get();

        return response()->json([
            'status' => true,
            'applications' => $applications,
        ], 200);
    }

    /**
     * Approuve une demande d'inscription de structure.
     * Crée une StructureSante et un utilisateur avec le rôle 'health_structure'.
     * Accessible uniquement aux administrateurs.
     *
     * @param  int  $id_application
     * @return \Illuminate->Http->JsonResponse
     */
    public function approve($id_application)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $application = StructureApplication::where('id_application', $id_application)
                                            ->where('statut_demande', 'en_attente')
                                            ->first();

        if (!$application) {
            return response()->json([
                'status' => false,
                'message' => 'Demande d\'inscription non trouvée ou déjà traitée.',
            ], 404);
        }

        DB::beginTransaction();
        try {
            // 1. Créer un nouvel utilisateur pour cette structure
            $tempPassword = Str::random(10); // Mot de passe temporaire
            $structureUser = Utilisateur::create([
                'nom' => $application->nom_structure, // Utilise le nom de la structure comme nom d'utilisateur initial
                'prenom' => 'Gestionnaire', // Peut être défini plus tard par la structure
                'email' => $application->email_contact,
                'password' => Hash::make($tempPassword),
                'role' => 'health_structure', // Rôle spécifique pour le gestionnaire de structure
                'statut_compte' => 'actif',
                'date_inscription' => now(),
            ]);

            // 2. Créer la structure de santé
            $structureSante = StructureSante::create([
                'nom_structure' => $application->nom_structure,
                'type_structure' => $application->type_structure,
                'adresse' => $application->adresse,
                'quartier' => $application->quartier,
                'ville' => $application->ville,
                'commune' => $application->commune,
                'departement' => $application->departement,
                'latitude' => $application->latitude,
                'longitude' => $application->longitude,
                'telephone_principal' => $application->telephone_principal,
                'telephone_secondaire' => $application->telephone_secondaire,
                'email_contact' => $application->email_contact,
                'site_web' => $application->site_web,
                'horaires_ouverture' => $application->horaires_ouverture,
                'description' => $application->description,
                'logo' => $application->logo, // Le logo est déplacé si besoin
                'statut_verification' => 'verifie', // Marqué comme vérifié
                'id_utilisateur' => $structureUser->id_utilisateur, // Lien vers le nouvel utilisateur
            ]);

            // Optional: Move logo from 'logos/applications' to 'logos/structures'
            if ($application->logo && Storage::disk('public')->exists($application->logo)) {
                $newLogoPath = 'logos/' . basename($application->logo);
                Storage::disk('public')->move($application->logo, $newLogoPath);
                $structureSante->logo = $newLogoPath;
                $structureSante->save();
            }

            // 3. Mettre à jour le statut de la demande d'inscription
            $application->statut_demande = 'approuve';
            $application->save();

            DB::commit();

            // Optionnel : Envoyer un email au gestionnaire de la structure avec les identifiants temporaires
            // Mail::to($structureUser->email)->send(new StructureApprovedMail($structureUser, $tempPassword));

            return response()->json([
                'status' => true,
                'message' => 'Demande d\'inscription approuvée avec succès. La structure et son compte ont été créés.',
                'structure_sante' => $structureSante,
                'gestionnaire_email' => $structureUser->email,
                'mot_de_passe_temporaire' => $tempPassword, // À ne pas faire en production, envoyer par email !
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            // Supprimer le logo si déplacé avant le rollback
            if (isset($newLogoPath) && Storage::disk('public')->exists($newLogoPath)) {
                Storage::disk('public')->delete($newLogoPath);
            }
            return response()->json([
                'status' => false,
                'message' => 'Erreur lors de l\'approbation de la demande : ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Rejette une demande d'inscription de structure.
     * Accessible uniquement aux administrateurs.
     *
     * @param  \Illuminate->Http->Request  $request
     * @param  int  $id_application
     * @return \Illuminate->Http->JsonResponse
     */
    public function reject(Request $request, $id_application)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $validator = Validator::make($request->all(), [
            'motif_rejet' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Un motif de rejet est requis.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $application = StructureApplication::where('id_application', $id_application)
                                            ->where('statut_demande', 'en_attente')
                                            ->first();

        if (!$application) {
            return response()->json([
                'status' => false,
                'message' => 'Demande d\'inscription non trouvée ou déjà traitée.',
            ], 404);
        }

        $application->statut_demande = 'rejete';
        $application->motif_rejet = $request->motif_rejet;
        $application->save();

        // Optionnel : Envoyer un email à l'utilisateur soumissionnaire pour l'informer du rejet

        return response()->json([
            'status' => true,
            'message' => 'Demande d\'inscription rejetée avec succès.',
            'application' => $application,
        ], 200);
    }
}
