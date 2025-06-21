<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CompagnieAssurance; // Assurez-vous d'importer votre modèle
use Illuminate\Support\Carbon;     // Pour les timestamps

class CompagnieAssuranceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $assurances = [
            [
                'nom_assurance' => 'NSIA Assurances Bénin',
                'logo' => null, // Laissez null ou mettez un chemin si vous avez des logos
                'description' => 'Un des leaders de l\'assurance en Afrique de l\'Ouest, offrant une gamme complète de produits.',
                'contact' => '+229 21 31 35 43',
                'site_web' => 'https://www.nsiaassurances.com/benin/',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nom_assurance' => 'Allianz Africa Bénin',
                'logo' => null,
                'description' => 'Filiale du groupe Allianz, un des plus grands assureurs mondiaux, présente au Bénin.',
                'contact' => '+229 21 31 29 45',
                'site_web' => 'https://www.allianz.ci/fr/benin.html',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nom_assurance' => 'SUNU Assurances Bénin',
                'logo' => null,
                'description' => 'Groupe panafricain d\'assurance vie et non-vie, acteur majeur dans la sous-région.',
                'contact' => '+229 21 31 35 25',
                'site_web' => 'https://sunu-group.com/fr-fr/benin/',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nom_assurance' => 'GSA - Générale des Assurances',
                'logo' => null,
                'description' => 'Compagnie d\'assurances générale au Bénin, offrant des solutions pour les particuliers et les entreprises.',
                'contact' => '+229 21 31 16 02',
                'site_web' => 'http://www.gsa-benin.com/',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nom_assurance' => 'Sanlam Bénin (Anciennement Saham Assurance)',
                'logo' => null,
                'description' => 'Membre du groupe Sanlam, leader des services financiers en Afrique.',
                'contact' => '+229 21 31 34 68',
                'site_web' => 'https://sanlam.com/fr-ci/benin/',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nom_assurance' => 'GTA Assurances Bénin',
                'logo' => null,
                'description' => 'Spécialiste des assurances terrestres et aériennes, avec une forte expertise locale.',
                'contact' => '+229 21 31 22 28',
                'site_web' => 'http://www.gta-assurances.com/',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nom_assurance' => 'Benefactor Assurance',
                'logo' => null,
                'description' => 'Propose des assurances vie et non-vie, axées sur la protection des biens et des personnes.',
                'contact' => '+229 21 32 02 02',
                'site_web' => 'http://www.benefactorassurances.com/',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nom_assurance' => 'Wafa Assurance Bénin',
                'logo' => null,
                'description' => 'Filiale d\'Attijariwafa Bank, engagée dans l\'assurance vie et les assurances dommages.',
                'contact' => '+229 21 31 01 01',
                'site_web' => 'https://www.wafaassurance.com/',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nom_assurance' => 'Assurances Générales du Bénin (AGB)',
                'logo' => null,
                'description' => 'Compagnie d\'assurance locale offrant une large gamme de produits adaptés au marché béninois.',
                'contact' => '+229 21 30 18 18',
                'site_web' => null, // À vérifier si un site web existe
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nom_assurance' => 'Fidelity Assurance Bénin',
                'logo' => null,
                'description' => 'Fournit des solutions d\'assurance fiables et personnalisées pour ses clients.',
                'contact' => '+229 21 31 66 11',
                'site_web' => null, // À vérifier si un site web existe
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($assurances as $assurance) {
            CompagnieAssurance::create($assurance);
        }
    }
}