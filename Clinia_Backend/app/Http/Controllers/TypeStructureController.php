// app/Http/Controllers/TypeStructureController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StructureSante; // Correctement importé et utilisé

class TypeStructureController extends Controller
{
    /**
     * Retourne la liste des types de structure valides.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Récupère les types de structure définis dans la constante
        $types = StructureSante::VALID_STRUCTURE_TYPES; // Cette ligne est correcte.

        $formattedTypes = [];
        foreach ($types as $type) {
            $label = ucfirst(str_replace('_', ' ', $type));
            $formattedTypes[] = [
                'value' => $type,
                'label' => $label,
            ];
        }

        return response()->json([
            'status' => true,
            'message' => 'Types de structure récupérés avec succès.',
            'data' => $formattedTypes,
        ], 200);
    }
}