<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    /**
     * Affiche une liste de tous les services.
     * Accessible à tous.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $services = Service::all();
        return response()->json([
            'status' => true,
            'services' => $services,
        ], 200);
    }

    /**
     * Crée un nouveau service.
     * Accessible uniquement aux administrateurs.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $validator = Validator::make($request->all(), [
            'nom_service' => 'required|string|max:255|unique:services,nom_service',
            'description' => 'nullable|string',
            'categorie' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $service = Service::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Service créé avec succès.',
            'service' => $service,
        ], 201);
    }

    /**
     * Affiche un service spécifique.
     * Accessible à tous.
     *
     * @param  int  $id_service
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id_service)
    {
        $service = Service::find($id_service);

        if (!$service) {
            return response()->json([
                'status' => false,
                'message' => 'Service non trouvé.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'service' => $service,
        ], 200);
    }

    /**
     * Met à jour un service existant.
     * Accessible uniquement aux administrateurs.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id_service
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id_service)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $service = Service::find($id_service);

        if (!$service) {
            return response()->json([
                'status' => false,
                'message' => 'Service non trouvé.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom_service' => 'sometimes|required|string|max:255|unique:services,nom_service,' . $id_service . ',id_service',
            'description' => 'nullable|string',
            'categorie' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $service->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Service mis à jour avec succès.',
            'service' => $service,
        ], 200);
    }

    /**
     * Supprime un service.
     * Accessible uniquement aux administrateurs.
     *
     * @param  int  $id_service
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id_service)
    {
        // La vérification du rôle 'admin' sera faite par un middleware sur la route
        $service = Service::find($id_service);

        if (!$service) {
            return response()->json([
                'status' => false,
                'message' => 'Service non trouvé.',
            ], 404);
        }

        $service->delete();

        return response()->json([
            'status' => true,
            'message' => 'Service supprimé avec succès.',
        ], 200);
    }
}
