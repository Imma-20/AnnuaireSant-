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


// Routes d'authentification (publiques)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/forgot', [AuthController::class, 'forgotPassword']);

// Routes publiques pour la lecture des données (accessibles à tous)
Route::get('/structures-sante', [StructureSanteController::class, 'index']);
Route::get('/structures-sante/search', [StructureSanteController::class, 'search']);
Route::get('/structures-sante/{id}', [StructureSanteController::class, 'show']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::get('/produits', [ProduitController::class, 'index']);
Route::get('/produits/{id}', [ProduitController::class, 'show']);
Route::get('/compagnies-assurance', [CompagnieAssuranceController::class, 'index']);
Route::get('/compagnies-assurance/{id}', [CompagnieAssuranceController::class, 'show']);
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::get('/structures-sante/{id}/evaluations', [EvaluationController::class, 'indexByStructure']);


// Groupe de routes nécessitant une authentification (token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Routes pour l'utilisateur connecté (peut soumettre une structure, voir ses recherches, évaluer)
    Route::post('/structure-applications', [StructureApplicationController::class, 'store']); // Soumettre une structure
    Route::get('/my-searches', [RechercheController::class, 'index']); // Historique des recherches
    Route::delete('/my-searches/{id}', [RechercheController::class, 'destroy']); // Supprimer une recherche
    Route::post('/structures-sante/{id}/evaluations', [EvaluationController::class, 'store']); // Ajouter une évaluation
    Route::put('/evaluations/{id}', [EvaluationController::class, 'update']); // Modifier sa propre évaluation
    Route::delete('/evaluations/{id}', [EvaluationController::class, 'destroy']); // Supprimer sa propre évaluation

    // Routes pour les gestionnaires de structure (rôle 'health_structure')
    Route::middleware('can:manage-own-structure')->group(function () { // Vous devrez créer cette Gate/Policy
        Route::put('/structures-sante/{id}', [StructureSanteController::class, 'update']); // Mettre à jour sa propre structure
        // Gestion des services de la structure
        Route::post('/structures-sante/{id_structure}/services', [StructureServiceController::class, 'store']);
        Route::put('/structures-sante/{id_structure}/services/{id_service}', [StructureServiceController::class, 'update']);
        Route::delete('/structures-sante/{id_structure}/services/{id_service}', [StructureServiceController::class, 'destroy']);

        // Gestion des assurances de la structure
        Route::post('/structures-sante/{id_structure}/assurances', [StructureAssuranceController::class, 'store']);
        Route::put('/structures-sante/{id_structure}/assurances/{id_assurance}', [StructureAssuranceController::class, 'update']);
        Route::delete('/structures-sante/{id_structure}/assurances/{id_assurance}', [StructureAssuranceController::class, 'destroy']);

        // Gestion du stock de produits de la structure
        Route::post('/structures-sante/{id_structure}/stock-produits', [StockProduitController::class, 'storeOrUpdate']); // Pour ajouter/maj un produit au stock
        Route::delete('/structures-sante/{id_structure}/stock-produits/{id_produit}', [StockProduitController::class, 'destroy']); // Pour retirer un produit du stock
    });

    // Routes pour l'administrateur (rôle 'admin')
    Route::middleware('can:manage-admin-dashboard')->group(function () { // Vous devrez créer cette Gate/Policy
        // Gestion des structures de santé
        Route::delete('/structures-sante/{id}', [StructureSanteController::class, 'destroy']); // Supprimer une structure

        // Gestion des services
        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{id}', [ServiceController::class, 'update']);
        Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

        // Gestion des produits
        Route::post('/produits', [ProduitController::class, 'store']);
        Route::put('/produits/{id}', [ProduitController::class, 'update']);
        Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);

        // Gestion des compagnies d'assurance
        Route::post('/compagnies-assurance', [CompagnieAssuranceController::class, 'store']);
        Route::put('/compagnies-assurance/{id}', [CompagnieAssuranceController::class, 'update']);
        Route::delete('/compagnies-assurance/{id}', [CompagnieAssuranceController::class, 'destroy']);

        // Gestion des articles (admin peut voir tout, créer, modifier, supprimer)
        Route::get('/admin/articles', [ArticleController::class, 'adminIndex']); // Tous les articles pour l'admin
        Route::post('/articles', [ArticleController::class, 'store']);
        Route::put('/articles/{id}', [ArticleController::class, 'update']);
        Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);

        // Gestion des évaluations (admin peut voir et supprimer toutes les évaluations)
        Route::get('/admin/evaluations', [EvaluationController::class, 'adminIndex']); // Toutes les évaluations pour l'admin

        // Gestion des recherches (admin peut voir toutes les recherches)
        Route::get('/admin/recherches', [RechercheController::class, 'adminIndex']);

        // Gestion des demandes d'inscription de structure
        Route::get('/structure-applications/pending', [StructureApplicationController::class, 'pendingApplications']);
        Route::post('/structure-applications/{id}/approve', [StructureApplicationController::class, 'approve']);
        Route::post('/structure-applications/{id}/reject', [StructureApplicationController::class, 'reject']);

        // Gestion des services de structures (admin peut agir sur n'importe quelle structure)
        Route::post('/admin/structures-sante/{id_structure}/services', [StructureServiceController::class, 'store']);
        Route::put('/admin/structures-sante/{id_structure}/services/{id_service}', [StructureServiceController::class, 'update']);
        Route::delete('/admin/structures-sante/{id_structure}/services/{id_service}', [StructureServiceController::class, 'destroy']);

        // Gestion des assurances de structures (admin peut agir sur n'importe quelle structure)
        Route::post('/admin/structures-sante/{id_structure}/assurances', [StructureAssuranceController::class, 'store']);
        Route::put('/admin/structures-sante/{id_structure}/assurances/{id_assurance}', [StructureAssuranceController::class, 'update']);
        Route::delete('/admin/structures-sante/{id_structure}/assurances/{id_assurance}', [StructureAssuranceController::class, 'destroy']);

        // Gestion du stock de produits de structures (admin peut agir sur n'importe quelle structure)
        Route::post('/admin/structures-sante/{id_structure}/stock-produits', [StockProduitController::class, 'storeOrUpdate']);
        Route::delete('/admin/structures-sante/{id_structure}/stock-produits/{id_produit}', [StockProduitController::class, 'destroy']);
    });
});
