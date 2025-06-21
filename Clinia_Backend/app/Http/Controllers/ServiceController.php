<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\StructureSante;
use Illuminate\Support\Facades\DB;


class ServiceController extends Controller
{
    
    public function index()
    {
        $services = Service::all();
        return response()->json([
            'status' => true,
            'services' => $services,
        ], 200);
    }

    
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

    public function search(Request $request)
    {
        $query = StructureSante::with(['services', 'assurances'])
            ->where('statut_verification', 'verifie');

        // Filter by service IDs
        if ($request->filled('service_ids')) {
            $serviceIds = explode(',', $request->input('service_ids'));
            $query->whereHas('services', function ($q) use ($serviceIds) {
                $q->whereIn('id_service', $serviceIds);
            });
        }

        // Filter by structure type
        if ($request->filled('type_structure')) {
            $query->where('type_structure', $request->input('type_structure'));
        }

        // Filter by insurance company IDs
        if ($request->filled('assurance_ids')) {
            $assuranceIds = explode(',', $request->input('assurance_ids'));
            $query->whereHas('assurances', function ($q) use ($assuranceIds) {
                $q->whereIn('id_assurance', $assuranceIds);
            });
        }

        // Filter by geolocation and distance
        if ($request->filled('user_latitude') && $request->filled('user_longitude') && $request->filled('radius')) {
            $latitude = $request->input('user_latitude');
            $longitude = $request->input('user_longitude');
            $radius = $request->input('radius');

            $query->selectRaw("*, (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance", [$latitude, $longitude, $latitude])
                  ->having('distance', '<=', $radius);
        }

        $structures = $query->get();

        return response()->json([
            'status' => true,
            'structures' => $structures,
        ], 200);
    }
}
