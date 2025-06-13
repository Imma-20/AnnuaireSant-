<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('id_utilisateur'); // Changer le nom de la clé primaire
            $table->string('nom'); // Ajout du champ nom
            $table->string('prenom'); // Ajout du champ prénom
            $table->string('email')->unique();
            $table->string('password');
            $table->string('telephone')->nullable(); // Ajout du champ téléphone
            $table->date('date_inscription')->default(now()); // Ajout du champ date_inscription avec une valeur par défaut
            $table->string('role')->default('admin'); // Ajout du champ role avec la valeur par défaut 'admin'
            $table->timestamp('derniere_connexion')->nullable(); // Ajout du champ dernière connexion
            $table->enum('statut_compte', ['actif', 'inactif'])->default('actif'); // Ajout du champ statut_compte
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
