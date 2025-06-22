<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\StructureSante;
use App\Models\Service;
use App\Models\CompagnieAssurance;
use App\Models\User;
use Faker\Factory as Faker;

class StructureSanteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        $validStructureTypes = \App\Http\Controllers\StructureSanteController::VALID_STRUCTURE_TYPES;

        $serviceIds = Service::pluck('id_service')->toArray();
        $assuranceIds = CompagnieAssurance::pluck('id_assurance')->toArray();

        $healthStructureUserIds = User::where('role', 'health_structure')->pluck('id_utilisateur')->toArray();
        if (empty($healthStructureUserIds)) {
             $healthStructureUserIds = User::pluck('id_utilisateur')->toArray();
        }

        $beninCitiesAndCommunes = [
            'Cotonou' => ['Cotonou'],
            'Porto-Novo' => ['Porto-Novo'],
            'Abomey-Calavi' => ['Abomey-Calavi'],
            'Parakou' => ['Parakou'],
            'Djougou' => ['Djougou'],
            'Bohicon' => ['Bohicon'],
            'Natitingou' => ['Natitingou'],
            'Ouidah' => ['Ouidah'],
            'Lokossa' => ['Lokossa'],
            'Kandi' => ['Kandi'],
            'Abomey' => ['Abomey'],
            'Come' => ['Come'],
            'Savalou' => ['Savalou'],
            'Sakété' => ['Sakété'],
            'Pobè' => ['Pobè'],
            'Malanville' => ['Malanville'],
            'Bassila' => ['Bassila'],
            'Grand-Popo' => ['Grand-Popo'],
            'Allada' => ['Allada'],
            'Dogbo-Tota' => ['Dogbo-Tota'],
        ];

        // NOUVEAU : Liste des départements du Bénin
        $beninDepartments = [
            'Alibori', 'Atacora', 'Atlantique', 'Borgou', 'Collines', 'Couffo',
            'Donga', 'Littoral', 'Mono', 'Ouémé', 'Plateau', 'Zou'
        ];

        for ($i = 0; $i < 50; $i++) {
            $city = $faker->randomElement(array_keys($beninCitiesAndCommunes));
            $commune = $faker->randomElement($beninCitiesAndCommunes[$city]);

            $latitude = $faker->randomFloat(6, 6, 12);
            $longitude = $faker->randomFloat(6, 0.5, 4);

            $structure = StructureSante::create([
                'nom_structure' => $faker->company . ' ' . $faker->word . ' Santé',
                'type_structure' => $faker->randomElement($validStructureTypes),
                'adresse' => $faker->streetAddress,
                'quartier' => $faker->streetName,
                'ville' => $city,
                'commune' => $commune,
                // MODIFICATION ICI : Utilisez la liste des départements du Bénin
                'departement' => $faker->randomElement($beninDepartments),
                'latitude' => $latitude,
                'longitude' => $longitude,
                'telephone_principal' => $faker->phoneNumber,
                'telephone_secondaire' => $faker->optional(0.5)->phoneNumber,
                'email_contact' => $faker->unique()->safeEmail,
                'site_web' => $faker->optional(0.7)->url,
                'horaires_ouverture' => json_encode([
                    'lundi' => '08:00-18:00',
                    'mardi' => '08:00-18:00',
                    'mercredi' => '08:00-18:00',
                    'jeudi' => '08:00-18:00',
                    'vendredi' => '08:00-18:00',
                    'samedi' => '09:00-13:00',
                    'dimanche' => 'fermé',
                ]),
                'est_de_garde' => $faker->boolean(20),
                'periode_garde_debut' => $faker->optional(0.1)->dateTimeThisYear,
                'periode_garde_fin' => $faker->optional(0.1)->dateTimeThisYear('+1 month'),
                'description' => $faker->paragraph(3),
                'statut_verification' => $faker->boolean(90) ? 'verifie' : 'en_attente',
                'id_utilisateur' => $faker->randomElement($healthStructureUserIds) ?? null,
                'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
                'updated_at' => $faker->dateTimeBetween('-1 year', 'now'),
            ]);

            if (!empty($serviceIds)) {
                $randomServices = $faker->randomElements($serviceIds, $faker->numberBetween(1, min(5, count($serviceIds))));
                $structure->services()->attach($randomServices);
            }

            if (!empty($assuranceIds)) {
                $randomAssurances = $faker->randomElements($assuranceIds, $faker->numberBetween(1, min(3, count($assuranceIds))));
                $syncData = [];
                foreach ($randomAssurances as $assuranceId) {
                    $syncData[$assuranceId] = ['modalites_specifiques' => $faker->optional(0.5)->sentence()];
                }
                $structure->assurances()->sync($syncData);
            }
        }
    }
}