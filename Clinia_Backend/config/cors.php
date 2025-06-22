<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // TRÈS IMPORTANT : Listez ici TOUTES les origines (URLs et ports) de vos projets React.
    'allowed_origins' => [
        'http://localhost:5173',    // Votre premier projet (Vite)
        'http://127.0.0.1:5173',    // Variante IPv4 pour le premier projet

        'http://localhost:8080',    // Votre deuxième projet (sur le port 8080)
        'http://127.0.0.1:8080',    // Variante IPv4 pour le deuxième projet

        'http://localhost:8081',    // Votre troisième projet (sur le port 8081)
        'http://127.0.0.1:8081',    // Variante IPv4 pour le troisième projet

        // Si vos projets React sont déjà déployés (même en interne) avec des noms de domaine,
        // ou si vous travaillez en équipe et utilisez l'adresse IP de votre machine, ajoutez-les ici :
        // 'https://mon-app-client.com',
        // 'https://mon-app-admin.com',
        // 'https://mon-app-structure-sante.com',
        // 'http://VOTRE_ADRESSE_IP_LOCALE:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // TRÈS IMPORTANT : Passez cette valeur à 'true'.
    // C'est indispensable si vos frontends envoient des cookies (comme ceux de Laravel Sanctum pour CSRF).
    'supports_credentials' => true,

];