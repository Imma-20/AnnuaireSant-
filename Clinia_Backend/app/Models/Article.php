<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    use HasFactory;

    protected $table = 'articles';
    protected $primaryKey = 'id_article';

    protected $fillable = [
        'titre',
        'contenu',
        'auteur_id',
        'categorie',
        'tags',
        'image_principale',
        'statut',
    ];

    protected $casts = [
        'tags' => 'array', // Convertit le JSON en tableau PHP
    ];

    /**
     * Relation avec l'auteur de l'article.
     */
    public function auteur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'auteur_id', 'id_utilisateur');
    }
}
