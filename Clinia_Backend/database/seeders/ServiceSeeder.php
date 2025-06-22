<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('services')->insert([
            ['nom_service' => 'Consultation Générale', 'description' => 'Consultation médicale standard pour tous types de problèmes de santé.', 'categorie' => 'Médecine Générale', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Urgence 24/7', 'description' => 'Prise en charge des urgences médicales et traumatologiques 24h/24, 7j/7.', 'categorie' => 'Urgence', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Radiologie et Imagerie', 'description' => 'Examens d\'imagerie médicale (radio, écho, IRM, scanner).', 'categorie' => 'Diagnostic', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Analyses de Laboratoire', 'description' => 'Prélèvements sanguins, urinaires et autres analyses biologiques.', 'categorie' => 'Diagnostic', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Chirurgie', 'description' => 'Interventions chirurgicales diverses.', 'categorie' => 'Spécialité Médicale', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Pédiatrie', 'description' => 'Soins médicaux pour les enfants et adolescents.', 'categorie' => 'Spécialité Médicale', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Gynécologie', 'description' => 'Soins de santé féminine, y compris obstétrique et suivi de grossesse.', 'categorie' => 'Spécialité Médicale', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Cardiologie', 'description' => 'Diagnostic et traitement des maladies du cœur.', 'categorie' => 'Spécialité Médicale', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Dentisterie', 'description' => 'Soins et hygiène buccodentaire.', 'categorie' => 'Spécialité Médicale', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Pharmacie de garde', 'description' => 'Dispensation de médicaments en dehors des heures normales.', 'categorie' => 'Pharmacie', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}