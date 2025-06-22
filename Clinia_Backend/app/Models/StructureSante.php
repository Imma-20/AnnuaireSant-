<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon; // Indispensable pour la propriété accesseur getIsOpenNowAttribute
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne; // Si vous avez une relation HasOne avec l'utilisateur

class StructureSante extends Model
{
    use HasFactory;

    protected $table = 'structures_santes'; // Assurez-vous que c'est le nom exact de votre table
    protected $primaryKey = 'id_structure'; // Assurez-vous que c'est le nom exact de votre clé primaire
    public $incrementing = true; // Par défaut, mais bien de le préciser si la clé est un entier auto-incrémenté
    protected $keyType = 'int'; // Par défaut, mais bien de le préciser

    protected $fillable = [
        'nom_structure',
        'type_structure',
        'adresse',
        'quartier',
        'ville',
        'commune',
        'departement',
        'latitude',
        'longitude',
        'telephone_principal',
        'telephone_secondaire',
        'email_contact',
        'site_web',
        'horaires_ouverture', // Très important pour le filtre "ouvert maintenant"
        'est_de_garde',
        'periode_garde_debut',
        'periode_garde_fin',
        'description',
        'logo',
        'statut_verification',
        'id_utilisateur', // Pour lier à l'utilisateur gestionnaire de la structure
    ];

    protected $casts = [
        'horaires_ouverture' => 'json', // Laravel va automatiquement convertir entre JSON et tableau/objet PHP
        'est_de_garde' => 'boolean',
        'periode_garde_debut' => 'date', // Cast en objet Carbon
        'periode_garde_fin' => 'date', // Cast en objet Carbon
    ];

    // !!! C'EST ICI QUE LA CONSTANTE DOIT ÊTRE DÉFINIE !!!
    public const VALID_STRUCTURE_TYPES = [
        'pharmacie',
        'hopital',
        'laboratoire',
        'clinique',
        'centre_medical',
        'veterinaire',
        'centre_reeducation',
        'cabinet_dentaire',
        'cabinet_neurologie',
        'autre',
        'cabinet_imagerie',
        'ambulance'
    ];

    // Relation Many-to-Many avec les Services
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'structure_services', 'id_structure', 'id_service')
            ->withPivot('disponibilite', 'informations_supplementaires')
            ->withTimestamps();
    }

    // Relation Many-to-Many avec les Compagnies d'Assurance
    public function assurances(): BelongsToMany
    {
        return $this->belongsToMany(
            \App\Models\CompagnieAssurance::class,
            'structure_assurances',
            'id_structure',
            'id_assurance'
        )->withPivot('modalites_specifiques')
         ->withTimestamps();
    }

    // Relation One-to-Many avec les Évaluations
    // Une structure peut avoir plusieurs évaluations
    public function evaluations(): HasMany
    {
        // Assurez-vous que le modèle Evaluation.php existe et que la clé étrangère est id_structure
        return $this->hasMany(Evaluation::class, 'id_structure', 'id_structure');
    }

    // Relation Many-to-Many avec les Produits (si la relation est bien entre StructureSante et Produit)
    // Une structure peut avoir plusieurs produits en stock, et un produit peut être en stock dans plusieurs structures
    // La table pivot est 'produit_structure' ou 'structure_produits'
    public function produitsEnStock(): BelongsToMany
    {
        // Ajustez 'produit_structure', 'id_structure', 'id_produit' selon votre migration
        return $this->belongsToMany(Produit::class, 'produit_structure', 'id_structure', 'id_produit')
                    ->withPivot('quantite_stock', 'prix_vente') // Exemple de colonnes pivot
                    ->withTimestamps();
    }

    // Relation Many-to-One ou One-to-One avec l'utilisateur (le gestionnaire de la structure)
    // Une structure est gérée par un utilisateur
    public function utilisateur(): BelongsTo // Ou HasOne si vous préférez la relation inverse sur l'utilisateur
    {
        return $this->belongsTo(User::class, 'id_utilisateur', 'id_utilisateur'); // Assurez-vous que votre modèle User/Utilisateur existe
    }


    // --- Accesseurs Personnalisés ---

    /**
     * Vérifie si la structure est ouverte à l'heure actuelle.
     * Dépend de la colonne `horaires_ouverture` castée en `json`.
     * @return bool
     */
    public function getIsOpenNowAttribute(): bool
    {
        // Si les horaires ne sont pas définis, la structure n'est pas considérée comme ouverte.
        if (empty($this->horaires_ouverture)) {
            return false;
        }

        // Obtenez le jour de la semaine actuel en anglais (ex: 'monday', 'tuesday')
        // en utilisant le fuseau horaire spécifique à votre région (Afrique/Porto-Novo)
        $currentDayName = strtolower(Carbon::now('Africa/Porto-Novo')->englishDayOfWeek);
        $currentTime = Carbon::now('Africa/Porto-Novo'); // L'heure complète actuelle

        $horaires = $this->horaires_ouverture; // 'horaires_ouverture' est déjà un tableau/objet grâce au cast 'json'

        // Vérifie si le jour actuel est défini dans les horaires et s'il est marqué comme "ouvert"
        if (!isset($horaires[$currentDayName]) || !isset($horaires[$currentDayName]['open']) || !$horaires[$currentDayName]['open']) {
            return false;
        }

        $openTimeStr = $horaires[$currentDayName]['start'] ?? null;
        $closeTimeStr = $horaires[$currentDayName]['end'] ?? null;

        // Si les heures de début ou de fin ne sont pas définies pour le jour
        if (!$openTimeStr || !$closeTimeStr) {
            return false;
        }

        try {
            // Parse les heures d'ouverture et de fermeture du jour actuel
            $openingTime = Carbon::parse($openTimeStr);
            $closingTime = Carbon::parse($closeTimeStr);

            // Gère les horaires qui chevauchent minuit (ex: ouvert de 22h à 6h le lendemain)
            if ($closingTime->lt($openingTime)) {
                return $currentTime->between($openingTime, Carbon::parse('23:59:59')) || // Est-ce avant minuit
                       $currentTime->between(Carbon::parse('00:00:00'), $closingTime);   // Ou après minuit
            }

            // Cas normal : l'heure actuelle est entre l'heure d'ouverture et l'heure de fermeture
            return $currentTime->between($openingTime, $closingTime);

        } catch (\Exception $e) {
            // Enregistrez toute erreur de parsing des heures si elles sont mal formatées dans la BDD
            Log::error("Erreur de parsing des horaires pour la structure {$this->id_structure} : " . $e->getMessage());
            return false;
        }
    }
}