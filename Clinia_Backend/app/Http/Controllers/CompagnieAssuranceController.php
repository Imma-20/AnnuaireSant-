<?php

namespace App\Http\Controllers;

use App\Models\CompagnieAssurance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // Pour la gestion des fichiers (logos)


class CompagnieAssuranceController extends Controller
{
    
    public function index()
    {
        $compagnies = CompagnieAssurance::all();
        return response()->json([
            'status' => true,
            'compagnies' => $compagnies,
        ], 200);
    }

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
