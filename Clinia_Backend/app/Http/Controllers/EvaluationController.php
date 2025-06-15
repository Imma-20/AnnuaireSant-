<?php

namespace App\Http\Controllers;

use App\Models\Evaluation; // Note: Utilisé 'Evaluation' au singulier pour le modèle, vérifiez votre nom de modèle réel si c'est 'Evaluations' au pluriel.
use App\Models\StructureSante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; // Nécessaire pour Auth::user() ou Auth::check()

/**
 * @group Gestion des Évaluations
 *
 * Ces APIs permettent de gérer les évaluations des structures de santé par les utilisateurs.
 * Elles incluent la consultation, la soumission, la modification et la suppression d'évaluations.
 */
class EvaluationController extends Controller
{
    /**
     * Affiche les évaluations pour une structure spécifique.
     *
     * Cet endpoint retourne toutes les évaluations d'une structure de santé donnée,
     * à condition que la structure soit trouvée et vérifiée. Les évaluations incluent
     * les informations de l'utilisateur qui les a soumises.
     *
     * @urlParam id_structure int required L'ID unique de la structure de santé. Example: 1
     * @response {
     * "status": true,
     * "evaluations": [
     * {
     * "id_evaluation": 1,
     * "id_structure": 1,
     * "id_utilisateur": 1,
     * "note": 5,
     * "commentaire": "Excellent service!",
     * "created_at": "2023-01-01T12:00:00Z",
     * "updated_at": "2023-01-01T12:00:00Z",
     * "utilisateur": {
     * "id_utilisateur": 1,
     * "nom": "Doe",
     * "prenom": "John",
     * "email": "john.doe@example.com"
     * }
     * }
     * ]
     * }
     * @response 200 {
     * "status": true,
     * "evaluations": []
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée ou non vérifiée."
     * }
     */
    public function indexByStructure($id_structure)
    {
        $structure = StructureSante::find($id_structure);
        if (!$structure || $structure->statut_verification !== 'verifie') {
            return response()->json([
                'status' => false,
                'message' => 'Structure de santé non trouvée ou non vérifiée.',
            ], 404);
        }

        $evaluations = $structure->evaluations()->with('utilisateur')->get();
        return response()->json([
            'status' => true,
            'evaluations' => $evaluations,
        ], 200);
    }

    /**
     * Soumettre une évaluation pour une structure.
     *
     * Cet endpoint permet à un utilisateur authentifié de soumettre une nouvelle évaluation
     * pour une structure de santé vérifiée. Un utilisateur ne peut soumettre qu'une seule
     * évaluation par structure.
     *
     * @authenticated
     * @urlParam id_structure int required L'ID unique de la structure de santé à évaluer. Example: 1
     * @bodyParam note integer required La note attribuée à la structure (de 1 à 5). Example: 5
     * @bodyParam commentaire string Le commentaire facultatif de l'évaluation (max: 1000 caractères). Example: Le personnel est très professionnel et le service rapide.
     *
     * @response 201 {
     * "status": true,
     * "message": "Évaluation soumise avec succès.",
     * "evaluation": {
     * "id_structure": 1,
     * "id_utilisateur": 1,
     * "note": 5,
     * "commentaire": "Excellent service!",
     * "updated_at": "2023-10-27T10:00:00.000000Z",
     * "created_at": "2023-10-27T10:00:00.000000Z",
     * "id_evaluation": 1
     * }
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "note": ["Le champ note est requis."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour soumettre une évaluation."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Structure de santé non trouvée ou non vérifiée."
     * }
     * @response 409 {
     * "status": false,
     * "message": "Vous avez déjà soumis une évaluation pour cette structure."
     * }
     */
    public function store(Request $request, $id_structure)
    {
        // La vérification de l'authentification sera faite par un middleware sur la route
        $validator = Validator::make($request->all(), [
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $structure = StructureSante::find($id_structure);
        if (!$structure || $structure->statut_verification !== 'verifie') {
            return response()->json([
                'status' => false,
                'message' => 'Structure de santé non trouvée ou non vérifiée.',
            ], 404);
        }

        // Vérifier si l'utilisateur a déjà évalué cette structure
        $existingEvaluation = Evaluation::where('id_structure', $id_structure) // Utilisé 'Evaluation'
                                         ->where('id_utilisateur', auth()->user()->id_utilisateur)
                                         ->first();

        if ($existingEvaluation) {
            return response()->json([
                'status' => false,
                'message' => 'Vous avez déjà soumis une évaluation pour cette structure.',
            ], 409); // 409 Conflict
        }

        $evaluation = Evaluation::create([ // Utilisé 'Evaluation'
            'id_structure' => $id_structure,
            'id_utilisateur' => auth()->user()->id_utilisateur,
            'note' => $request->note,
            'commentaire' => $request->commentaire,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Évaluation soumise avec succès.',
            'evaluation' => $evaluation,
        ], 201);
    }

    /**
     * Mettre à jour une évaluation existante.
     *
     * Cet endpoint permet de modifier une évaluation existante. Seul l'utilisateur
     * qui a créé l'évaluation ou un administrateur peut effectuer cette action.
     *
     * @authenticated
     * @urlParam id_evaluation int required L'ID unique de l'évaluation à mettre à jour. Example: 1
     * @bodyParam note integer La nouvelle note (de 1 à 5). Peut être omis. Example: 4
     * @bodyParam commentaire string Le nouveau commentaire (max: 1000 caractères). Peut être omis. Example: Mon expérience a été bonne dans l'ensemble.
     *
     * @response 200 {
     * "status": true,
     * "message": "Évaluation mise à jour avec succès.",
     * "evaluation": {
     * "id_evaluation": 1,
     * "id_structure": 1,
     * "id_utilisateur": 1,
     * "note": 4,
     * "commentaire": "Mon expérience a été bonne dans l'ensemble.",
     * "updated_at": "2023-10-27T10:30:00Z",
     * "created_at": "2023-10-27T10:00:00Z"
     * }
     * }
     * @response 404 {
     * "status": false,
     * "message": "Évaluation non trouvée."
     * }
     * @response 400 {
     * "status": false,
     * "message": "Erreurs de validation.",
     * "errors": {
     * "note": ["Le champ note doit être compris entre 1 et 5."]
     * }
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à modifier cette évaluation."
     * }
     */
    public function update(Request $request, $id_evaluation)
    {
        $evaluation = Evaluation::find($id_evaluation); // Utilisé 'Evaluation'

        if (!$evaluation) {
            return response()->json([
                'status' => false,
                'message' => 'Évaluation non trouvée.',
            ], 404);
        }

        $user = Auth::user();
        // Vérifier si l'utilisateur est l'auteur de l'évaluation ou un admin
        if (!$user || ($user->id_utilisateur !== $evaluation->id_utilisateur && $user->role !== 'admin')) {
            return response()->json([
                'status' => false,
                'message' => 'Accès refusé. Vous n\'êtes pas autorisé à modifier cette évaluation.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'note' => 'sometimes|required|integer|min:1|max:5',
            'commentaire' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $evaluation->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Évaluation mise à jour avec succès.',
            'evaluation' => $evaluation,
        ], 200);
    }

    /**
     * Supprimer une évaluation.
     *
     * Cet endpoint permet de supprimer une évaluation existante. Seul l'utilisateur
     * qui a créé l'évaluation ou un administrateur peut effectuer cette action.
     *
     * @authenticated
     * @urlParam id_evaluation int required L'ID unique de l'évaluation à supprimer. Example: 1
     *
     * @response 200 {
     * "status": true,
     * "message": "Évaluation supprimée avec succès."
     * }
     * @response 404 {
     * "status": false,
     * "message": "Évaluation non trouvée."
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié. Vous devez être connecté pour supprimer cette évaluation."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas autorisé à supprimer cette évaluation."
     * }
     */
    public function destroy($id_evaluation)
    {
        $evaluation = Evaluation::find($id_evaluation); // Utilisé 'Evaluation'

        if (!$evaluation) {
            return response()->json([
                'status' => false,
                'message' => 'Évaluation non trouvée.',
            ], 404);
        }

        $user = Auth::user();
        // Vérifier si l'utilisateur est l'auteur de l'évaluation ou un admin
        if (!$user || ($user->id_utilisateur !== $evaluation->id_utilisateur && $user->role !== 'admin')) {
            return response()->json([
                'status' => false,
                'message' => 'Accès refusé. Vous n\'êtes pas autorisé à supprimer cette évaluation.',
            ], 403);
        }

        $evaluation->delete();

        return response()->json([
            'status' => true,
            'message' => 'Évaluation supprimée avec succès.',
        ], 200);
    }

    /**
     * Affiche toutes les évaluations (pour le tableau de bord administrateur).
     *
     * Cet endpoint est réservé aux administrateurs et permet de visualiser toutes les évaluations
     * soumises, quel que soit l'utilisateur ou la structure.
     * Les évaluations sont retournées avec les informations de la structure et de l'utilisateur associées.
     *
     * @authenticated
     * @response {
     * "status": true,
     * "evaluations": [
     * {
     * "id_evaluation": 1,
     * "id_structure": 1,
     * "id_utilisateur": 1,
     * "note": 5,
     * "commentaire": "Très bonne clinique!",
     * "created_at": "2023-01-01T12:00:00Z",
     * "updated_at": "2023-01-01T12:00:00Z",
     * "structure": {
     * "id_structure": 1,
     * "nom_structure": "Hôpital Central"
     * },
     * "utilisateur": {
     * "id_utilisateur": 1,
     * "nom": "Doe",
     * "prenom": "John"
     * }
     * }
     * ]
     * }
     * @response 401 {
     * "status": false,
     * "message": "Non authentifié."
     * }
     * @response 403 {
     * "status": false,
     * "message": "Accès refusé. Vous n'êtes pas administrateur."
     * }
     */
    public function adminIndex()
    {
        $evaluations = Evaluation::with(['structure', 'utilisateur'])->get(); // Utilisé 'Evaluation'
        return response()->json([
            'status' => true,
            'evaluations' => $evaluations,
        ], 200);
    }
}
