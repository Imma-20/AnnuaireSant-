<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash; // Importez la façade Hash
use App\Models\Utilisateur; // Importez votre modèle Utilisateur

return new class extends Migration
{
    /**
     * Exécute les migrations.
     */
    public function up(): void
    {
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id('id_utilisateur'); // Changer le nom de la clé primaire
            $table->string('nom'); // Ajout du champ nom
            $table->string('prenom'); // Ajout du champ prénom
            $table->string('email')->unique();
            $table->string('password');
            $table->string('telephone')->nullable(); // Ajout du champ téléphone
            $table->date('date_inscription')->default(now()); // Ajout du champ date_inscription avec une valeur par défaut
            // Modifié: Utilisation de 'enum' pour le champ 'role' afin de spécifier les valeurs autorisées
            // et s'assurer que les nouvelles inscriptions publiques ont 'user' comme rôle par défaut.
            $table->enum('role', ['admin', 'health_structure', 'user'])->default('user');
            $table->timestamp('derniere_connexion')->nullable(); // Ajout du champ dernière connexion
            $table->enum('statut_compte', ['actif', 'inactif'])->default('actif'); // Ajout du champ statut_compte
            $table->rememberToken();
            $table->timestamps();
        });

        // --- Insertion des deux utilisateurs admin par défaut ---
        // Assurez-vous que le modèle 'Utilisateur' est correctement configuré
        // avec les propriétés $fillable pour permettre l'assignation de masse.
        // C'est déjà le cas dans votre modèle fourni précédemment.

        Utilisateur::create([
            'nom' => 'Super',
            'prenom' => 'Admin One',
            'email' => 'mechacassongba@gmail.com', 
            'password' => Hash::make('Admin123'), 
            'role' => 'admin',
            'date_inscription' => now(),
            'statut_compte' => 'actif',
        ]);

        Utilisateur::create([
            'nom' => 'Super',
            'prenom' => 'Admin Two',
            'email' => 'houessoumac848@gmail.com',
            'password' => Hash::make('Admin123'), 
            'role' => 'admin',
            'date_inscription' => now(),
            'statut_compte' => 'actif',
        ]);
        // --- Fin de l'insertion des utilisateurs admin ---
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};
