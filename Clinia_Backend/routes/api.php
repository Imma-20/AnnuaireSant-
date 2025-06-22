<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\StructureSanteController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CompagnieAssuranceController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\RechercheController;
use App\Http\Controllers\StructureApplicationController;
use App\Http\Controllers\StructureServiceController;
use App\Http\Controllers\StructureAssuranceController;
use App\Http\Controllers\StockProduitController;

use Illuminate\Support\Facades\Route;


// --- Routes d'authentification (publiques) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/forgot', [AuthController::class, 'forgotPassword']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);

Route::post('/admin/register', [AuthController::class, 'registerAdmin']);

// --- Routes publiques pour la lecture des données (accessibles à tous) ---

// Structures de santé
Route::get('/structures', [StructureSanteController::class, 'index']);
Route::get('/structures/search', [StructureSanteController::class, 'search']); // Placer avant {id}
Route::get('/structures-counts', [StructureSanteController::class, 'getStructuresCounts']);
Route::get('/structures/{id_structure}', [StructureSanteController::class, 'show']); // Utilisation de {id_structure} pour la cohérence

// Services
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

// Produits
Route::get('/produits', [ProduitController::class, 'index']);
Route::get('/produits/{id}', [ProduitController::class, 'show']);

// Compagnies d'assurance
// CORRECTION ICI : Changer 'compagnies-assurance' en 'assurances' pour correspondre au frontend
// Utilisez Route::apiResource pour gérer toutes les méthodes (index, show, store, update, destroy)
// Cela simplifie grandement la gestion de ces routes.
Route::apiResource('assurances', CompagnieAssuranceController::class)->parameters([
    'assurances' => 'id_assurance' // Spécifie le paramètre d'ID pour les routes générées
]);

// Articles de blog
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);

// Évaluations (publiques, par structure)
Route::get('/structures/{id_structure}/evaluations', [EvaluationController::class, 'indexByStructure']);


// --- Groupe de routes nécessitant une authentification (token Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Routes pour l'utilisateur connecté (rôle 'user' ou 'health_structure' non admin)
    Route::post('/structure-applications', [StructureApplicationController::class, 'store']);
    Route::get('/my-searches', [RechercheController::class, 'index']);
    Route::delete('/my-searches/{id}', [RechercheController::class, 'destroy']);

    Route::post('/structures/{id_structure}/evaluations', [EvaluationController::class, 'store']);
    Route::put('/evaluations/{id}', [EvaluationController::class, 'update']);
    Route::delete('/evaluations/{id}', [EvaluationController::class, 'destroy']);

    Route::post('/structures', [StructureSanteController::class, 'store']);

    // --- Routes pour les gestionnaires de structure (rôle 'health_structure') ---
    Route::middleware('can:manage-own-structure')->group(function () {
        Route::put('/structures/{id_structure}', [StructureSanteController::class, 'update']);
        Route::patch('/structures/{id_structure}', [StructureSanteController::class, 'update']);

        Route::post('/structures/{id_structure}/services', [StructureServiceController::class, 'store']);
        Route::put('/structures/{id_structure}/services/{id_service}', [StructureServiceController::class, 'update']);
        Route::delete('/structures/{id_structure}/services/{id_service}', [StructureServiceController::class, 'destroy']);

        Route::post('/structures/{id_structure}/assurances', [StructureAssuranceController::class, 'store']);
        Route::put('/structures/{id_structure}/assurances/{id_assurance}', [StructureAssuranceController::class, 'update']);
        Route::delete('/structures/{id_structure}/assurances/{id_assurance}', [StructureAssuranceController::class, 'destroy']);

        Route::post('/structures/{id_structure}/stock-produits', [StockProduitController::class, 'storeOrUpdate']);
        Route::delete('/structures/{id_structure}/stock-produits/{id_produit}', [StockProduitController::class, 'destroy']);
    });

    // --- Routes pour l'administrateur (rôle 'admin') ---
    Route::middleware('can:manage-admin-dashboard')->group(function () {
        Route::delete('/structures/{id_structure}', [StructureSanteController::class, 'destroy']);

        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{id}', [ServiceController::class, 'update']);
        Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

        Route::post('/produits', [ProduitController::class, 'store']);
        Route::put('/produits/{id}', [ProduitController::class, 'update']);
        Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);

        // Correction ici : Retirer les routes individuelles pour les compagnies d'assurance
        // car Route::apiResource('assurances', ...) les gère déjà toutes, y compris les routes admin.
        // Les middlewares géreront les permissions d'accès aux méthodes.
        // Route::post('/compagnies-assurance', [CompagnieAssuranceController::class, 'store']); // Redondant
        // Route::put('/compagnies-assurance/{id}', [CompagnieAssuranceController::class, 'update']); // Redondant
        // Route::delete('/compagnies-assurance/{id}', [CompagnieAssuranceController::class, 'destroy']); // Redondant

        Route::get('/admin/articles', [ArticleController::class, 'adminIndex']);
        Route::post('/articles', [ArticleController::class, 'store']);
        Route::put('/articles/{id}', [ArticleController::class, 'update']);
        Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);

        Route::get('/admin/evaluations', [EvaluationController::class, 'adminIndex']);
        Route::delete('/admin/evaluations/{id}', [EvaluationController::class, 'destroy']);

        Route::get('/admin/recherches', [RechercheController::class, 'adminIndex']);
        Route::delete('/admin/recherches/{id}', [RechercheController::class, 'destroy']);

        Route::get('/admin/structure-applications/pending', [StructureApplicationController::class, 'pendingApplications']);
        Route::post('/admin/structure-applications/{id}/approve', [StructureApplicationController::class, 'approve']);
        Route::post('/admin/structure-applications/{id}/reject', [StructureApplicationController::class, 'reject']);

        Route::post('/admin/structures/{id_structure}/services', [StructureServiceController::class, 'store']);
        Route::put('/admin/structures/{id_structure}/services/{id_service}', [StructureServiceController::class, 'update']);
        Route::delete('/admin/structures/{id_structure}/services/{id_service}', [StructureServiceController::class, 'destroy']);

        Route::post('/admin/structures/{id_structure}/assurances', [StructureAssuranceController::class, 'store']);
        Route::put('/admin/structures/{id_structure}/assurances/{id_assurance}', [StructureAssuranceController::class, 'update']);
        Route::delete('/admin/structures/{id_structure}/assurances/{id_assurance}', [StructureAssuranceController::class, 'destroy']);

        Route::post('/admin/structures/{id_structure}/stock-produits', [StockProduitController::class, 'storeOrUpdate']);
        Route::delete('/admin/structures/{id_structure}/stock-produits/{id_produit}', [StockProduitController::class, 'destroy']);
    });
});