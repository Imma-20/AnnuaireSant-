<?php

use Knuckles\Scribe\Extracting\Strategies;
use Knuckles\Scribe\Config\Defaults;
use Knuckles\Scribe\Config\AuthIn;
use function Knuckles\Scribe\Config\{removeStrategies, configureStrategy};

return [
    // Le HTML <title> pour la documentation générée.
    'title' => config('app.name').' API Documentation',

    // Une courte description de votre API. Sera incluse dans la page web des docs,
    // la collection Postman et la spécification OpenAPI.
    'description' => 'Documentation complète de l\'API Clinia pour la gestion des structures de santé, services, produits, et plus encore.',

    // L'URL de base affichée dans les docs et utilisée pour les "Try It Out" par défaut.
    // Assurez-vous que APP_URL est correctement défini dans votre fichier .env (ex: http://localhost:8000).
    'base_url' => config('APP_URL', 'http://localhost') . '/api',

    // Routes à inclure dans les docs
    'routes' => [
        [
            'uses' => [
                // Listez ici TOUS vos contrôleurs que vous voulez documenter.
                // Assurez-vous que le namespace est correct (App\Http\Controllers)
                // et que le nom de la classe est aussi correct.
                \App\Http\Controllers\AuthController::class . '@*',
                \App\Http\Controllers\ArticleController::class . '@*',
                \App\Http\Controllers\CompagnieAssuranceController::class . '@*',
                \App\Http\Controllers\EvaluationController::class . '@*',
                \App\Http\Controllers\ProduitController::class . '@*',
                \App\Http\Controllers\RechercheController::class . '@*',
                \App\Http\Controllers\ServiceController::class . '@*',
                \App\Http\Controllers\StockProduitController::class . '@*',
                \App\Http\Controllers\StructureApplicationController::class . '@*',
                \App\Http\Controllers\StructureAssuranceController::class . '@*',
                \App\Http\Controllers\StructureSanteController::class . '@*',
                \App\Http\Controllers\StructureServiceController::class . '@*',
                // Si vous ajoutez de nouveaux contrôleurs, pensez à les ajouter ici !
            ],
            'where' => [
                // Ceci est crucial. Si toutes vos routes API sont sous le préfixe 'api',
                // assurez-vous que ceci est configuré correctement.
                'prefix' => 'api/*',
            ],
            'apply' => [
                'headers' => [
                    'Accept' => 'application/json',
                ],
                'response_calls' => [
                    'methods' => ['GET'], // Limitez les appels de réponse automatiques aux méthodes GET pour éviter les effets de bord.
                    'url' => '/', // L'URL de base pour les appels de réponse.
                    'extra_headers' => [],
                    'extra_parameters' => [],
                    'body_parameters' => [],
                    'config_variables' => [
                        'APP_DEBUG' => false, // Désactive le mode debug pour les appels de réponse afin d'éviter les stack traces dans la doc.
                    ],
                ],
            ],
        ],
    ],

    // Le type de sortie de documentation à générer.
    // - "static" générera une page HTML statique dans le dossier /public/docs.
    // - "laravel" générera la documentation comme une vue Blade, vous permettant d'ajouter du routage et de l'authentification.
    'type' => 'laravel',

    // Thème de la documentation. Voir https://scribe.knuckles.wtf/laravel/reference/config#theme pour les options.
    'theme' => 'default',

    'static' => [
        // La documentation HTML, les assets et la collection Postman seront générés dans ce dossier.
        // Le Markdown source restera dans resources/docs.
        'output_path' => 'public/docs',
    ],

    'laravel' => [
        // Si Scribe doit automatiquement créer une route pour visualiser vos docs générés.
        'add_routes' => true,

        // Chemin URL à utiliser pour l'endpoint des docs (si `add_routes` est vrai).
        // Par défaut, `/docs` ouvre la page HTML, `/docs.postman` ouvre la collection Postman,
        // et `/docs.openapi` la spécification OpenAPI.
        'docs_url' => '/docs',

        // Répertoire dans `public` où stocker les assets CSS et JS.
        // Par défaut, les assets sont stockés dans `public/vendor/scribe`.
        'assets_directory' => null,

        // Middleware à attacher à l'endpoint des docs (si `add_routes` est vrai).
        'middleware' => [],
    ],

    'external' => [
        'html_attributes' => []
    ],

    'try_it_out' => [
        // Ajoute un bouton "Try It Out" à vos endpoints pour que les utilisateurs puissent tester directement depuis le navigateur.
        // N'oubliez pas d'activer les en-têtes CORS pour vos endpoints Laravel.
        'enabled' => true,

        // L'URL de base à utiliser dans le testeur API. Laissez null pour qu'elle soit la même que l'URL affichée (`scribe.base_url`).
        'base_url' => null,

        // [Laravel Sanctum] Récupère un token CSRF avant chaque requête et l'ajoute comme en-tête X-XSRF-TOKEN.
        'use_csrf' => false, // Généralement false pour les APIs purement "stateless" avec des tokens Bearer.

        // L'URL pour récupérer le token CSRF (si `use_csrf` est vrai).
        'csrf_url' => '/sanctum/csrf-cookie',
    ],

    // Comment votre API est-elle authentifiée ? Cette information sera utilisée dans les docs affichées,
    // les exemples générés et les appels de réponse.
    'auth' => [
        // Définissez ceci sur true si N'IMPORTE QUEL endpoint de votre API utilise l'authentification.
        'enabled' => true,

        // Définissez ceci sur true si votre API doit être authentifiée par défaut.
        // Si oui, vous devez également définir `enabled` (ci-dessus) sur true.
        // Vous pouvez ensuite utiliser @unauthenticated ou @authenticated sur des endpoints individuels pour changer leur statut par défaut.
        'default' => false,

        // Où le token d'authentification est-il censé être envoyé dans une requête ?
        // Pour les tokens Bearer (Sanctum), utilisez 'token'.
        'requires' => ['token'],

        // Où la valeur d'authentification est-elle censée être envoyée dans une requête ?
        // 'bearer' signifie dans l'en-tête 'Authorization: Bearer YOUR_TOKEN'.
        'in' => AuthIn::BEARER->value,

        // Le nom du paramètre d'authentification (ex: token, key, apiKey) ou de l'en-tête (ex: Authorization, Api-Key).
        'name' => 'Authorization',

        // La valeur du paramètre à utiliser par Scribe pour authentifier les appels de réponse.
        // Ceci NE SERA PAS inclus dans la documentation générée. Si vide, Scribe utilisera une valeur aléatoire.
        // Pour vos tests, vous pouvez mettre ici un token d'administrateur ou un token générique de test.
        'use_value' => env('SCRIBE_AUTH_KEY'), // Définit SCRIBE_AUTH_KEY dans votre .env si vous voulez un token spécifique

        // Texte d'aide pour le paramètre d'authentification dans les requêtes d'exemple.
        'placeholder' => '{YOUR_AUTH_TOKEN}', // Changé pour être plus explicite

        // Toute information supplémentaire liée à l'authentification pour vos utilisateurs. Markdown et HTML sont pris en charge.
        'extra_info' => 'Pour authentification, utilisez le token obtenu après connexion. <b>Génération du token de l\' API </b>.',
    ],

    // Texte à placer dans la section "Introduction", juste après la `description`. Markdown et HTML sont pris en charge.
    'intro_text' => <<<INTRO
        Cette documentation vise à fournir toutes les informations dont vous avez besoin pour travailler avec notre API.

        <aside>Au fur et à mesure que vous faites défiler, vous verrez des exemples de code pour interagir avec l'API dans différents langages de programmation dans la zone sombre à droite (ou dans le contenu sur mobile).
        Vous pouvez changer le langage utilisé avec les onglets en haut à droite (ou depuis le menu de navigation en haut à gauche sur mobile).</aside>
    INTRO,

    // Les langages dans lesquels les exemples de requêtes pour chaque endpoint seront affichés.
    // Options prises en charge : bash, javascript, php, python
    'example_languages' => [
        'bash',
        'javascript',
        'php', // J'ajoute PHP, souvent utile pour des projets Laravel
    ],

    // Génère une collection Postman (v2.1.0) en plus des docs HTML.
    'postman' => [
        'enabled' => true,
        'overrides' => [],
    ],

    // Génère une spécification OpenAPI (v3.0.1) en plus de la page web des docs.
    'openapi' => [
        'enabled' => true,
        'overrides' => [],
        'generators' => [],
    ],

    'groups' => [
        // Les endpoints qui n'ont pas de @group seront placés dans ce groupe par défaut.
        'default' => 'Endpoints généraux', // Renommé pour être plus clair

        // Vous pouvez ordonner les groupes et les endpoints ici si vous le souhaitez.
        // Exemple:
        // 'order' => [
        //     'Authentification et Gestion des Utilisateurs',
        //     'Gestion des Structures de Santé',
        //     // ... autres groupes dans l'ordre désiré
        // ],
        'order' => [],
    ],

    // Chemin du logo personnalisé.
    'logo' => false, // Conservez `false` si vous n'avez pas de logo spécifique à afficher.

    // Personnalise la valeur "Dernière mise à jour" affichée dans les docs.
    'last_updated' => 'Dernière mise à jour: {date:F j, Y} à {date:H:i}', // Plus précis

    'examples' => [
        // Définissez un seed pour Faker pour générer les mêmes valeurs d'exemple à chaque exécution.
        'faker_seed' => 1234,

        // Scribe essaiera de générer des modèles d'exemple pour les réponses API.
        // Par défaut, Scribe essaiera la factory du modèle, et si cela échoue, essaiera de récupérer le premier de la base de données.
        // Vous pouvez réorganiser ou supprimer les stratégies ici.
        'models_source' => ['factoryCreate', 'factoryMake', 'databaseFirst'],
    ],

    // Les stratégies que Scribe utilisera pour extraire les informations de vos routes.
    'strategies' => [
        'metadata' => [
            ...Defaults::METADATA_STRATEGIES,
        ],
        'headers' => [
            ...Defaults::HEADERS_STRATEGIES,
            Strategies\StaticData::withSettings(data: [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ]),
        ],
        'urlParameters' => [
            ...Defaults::URL_PARAMETERS_STRATEGIES,
        ],
        'queryParameters' => [
            ...Defaults::QUERY_PARAMETERS_STRATEGIES,
        ],
        'bodyParameters' => [
            ...Defaults::BODY_PARAMETERS_STRATEGIES,
        ],
        'responses' => configureStrategy(
            Defaults::RESPONSES_STRATEGIES,
            Strategies\Responses\ResponseCalls::withSettings(
                only: ['GET *'], // Génère des exemples de réponse uniquement pour les requêtes GET automatiques.
                // Recommandé : désactivez le mode debug dans les appels de réponse pour éviter les stack traces d'erreur.
                config: [
                    'app.debug' => false,
                ]
            )
        ),
        'responseFields' => [
            ...Defaults::RESPONSE_FIELDS_STRATEGIES,
        ]
    ],

    // Pour les appels de réponse, les réponses des ressources API et les réponses des transformateurs,
    // Scribe essaiera de démarrer des transactions de base de données, afin qu'aucune modification ne soit persistée dans votre base de données.
    // Indiquez à Scribe quelles connexions doivent être utilisées pour les transactions ici.
    'database_connections_to_transact' => [config('database.default')],

    'fractal' => [
        // Si vous utilisez un sérialiseur personnalisé avec league/fractal, vous pouvez le spécifier ici.
        'serializer' => null,
    ],
];
