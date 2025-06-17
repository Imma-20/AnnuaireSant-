<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $link; // Propriété publique pour passer le lien à la vue

    /**
     * Crée une nouvelle instance.
     */
    public function __construct($link)
    {
        $this->link = $link; // Initialisez le lien
    }

    /**
     * Construisez le message.
     * C'est la méthode principale pour définir le contenu de l'email.
     * Note: La méthode `content()` est préférée dans les versions récentes de Laravel.
     */
    public function build()
    {
        return $this->view('emails.reset-password')
                    ->with([
                        'link' => $this->link, // Passez le lien à la vue
                    ]);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Réinitialisation de votre mot de passe pour Clinia', // Sujet plus spécifique
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // Retourne une nouvelle instance de Content pour la vue
        return new Content(
            view: 'emails.reset-password',
            with: [
                'link' => $this->link, // Passez le lien à la vue via la méthode content aussi
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
