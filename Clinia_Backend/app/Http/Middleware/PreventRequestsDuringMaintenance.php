<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance as Middleware;

class PreventRequestsDuringMaintenance extends Middleware
{
    /**
     * The URIs that should be accessible while the application is in maintenance mode.
     *
     * @var array
     */
    protected $except = [
        // Ajoutez ici les URIs qui doivent être accessibles même en mode maintenance.
    ];
}
