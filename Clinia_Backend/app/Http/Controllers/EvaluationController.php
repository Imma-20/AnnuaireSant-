<?php

namespace App\Http\Controllers;

use App\Models\Evaluations;
use App\Models\StructureSante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EvaluationController extends Controller
{
    /**
     * Affiche les évaluations pour une structure spécifique.
     * Accessible à tous.
     *
     * @param  int  $id_structure
     * @return \Illuminate->Http->JsonResponse
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
     * Permet à un utilisateur de laisser une évaluation.
     * Nécessite l'authentification.
     *
     * @param  \Illuminate->Http->Request  $request
     * @param  int  $id_structure
     * @return \Illuminate->Http->JsonResponse
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
        $existingEvaluation = Evaluations::where('id_structure', $id_structure)
                                        ->where('id_utilisateur', auth()->user()->id_utilisateur)
                                        ->first();

        if ($existingEvaluation) {
            return response()->json([
                'status' => false,
                'message' => 'Vous avez déjà soumis une évaluation pour cette structure.',
            ], 409); // 409 Conflict
        }

        $evaluation = Evaluations::create([
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
     * Met à jour une évaluation existante.
     * Accessible à l'utilisateur qui l'a créée ou aux administrateurs.
     *
     * @param  \Illuminate->Http->Request  $request
     * @param  int  $id_evaluation
     * @return \Illuminate->Http->JsonResponse
     */
    public function update(Request $request, $id_evaluation)
    {
        $evaluation = Evaluations::find($id_evaluation);

        if (!$evaluation) {
            return response()->json([
                'status' => false,
                'message' => 'Évaluation non trouvée.',
            ], 404);
        }

        $user = Auth::user();
        // Vérifier si l'utilisateur est l'auteur de l'évaluation ou un admin
        if ($user->id_utilisateur !== $evaluation->id_utilisateur && $user->role !== 'admin') {
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
     * Supprime une évaluation.
     * Accessible à l'utilisateur qui l'a créée ou aux administrateurs.
     *
     * @param  int  $id_evaluation
     * @return \Illuminate->Http->JsonResponse
     */
    public function destroy($id_evaluation)
    {
        $evaluation = Evaluations::find($id_evaluation);

        if (!$evaluation) {
            return response()->json([
                'status' => false,
                'message' => 'Évaluation non trouvée.',
            ], 404);
        }

        $user = Auth::user();
        // Vérifier si l'utilisateur est l'auteur de l'évaluation ou un admin
        if ($user->id_utilisateur !== $evaluation->id_utilisateur && $user->role !== 'admin') {
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
     * Affiche toutes les évaluations (pour le dashboard admin).
     * Accessible uniquement aux administrateurs.
     *
     * @return \Illuminate->Http->JsonResponse
     */
    public function adminIndex()
    {
        $evaluations = Evaluations::with(['structure', 'utilisateur'])->get();
        return response()->json([
            'status' => true,
            'evaluations' => $evaluations,
        ], 200);
    }
}
