<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de votre mot de passe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f7f7f7;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .header h1 {
            color: #0056b3;
            font-size: 24px;
            margin: 0;
        }
        .content {
            padding-top: 20px;
            padding-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #22c55e; /* green-500 */
            color: #ffffff !important;
            padding: 12px 25px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            text-align: center;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Réinitialisation de votre mot de passe</h1>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
            <p>Pour réinitialiser votre mot de passe et accéder à votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
            <p style="text-align: center;">
                <a href="{{ $link }}" class="button">Réinitialiser mon mot de passe</a>
            </p>
            <p>Ce lien est valide pour une durée limitée (généralement 60 minutes). Si vous ne réinitialisez pas votre mot de passe dans ce délai, vous devrez faire une nouvelle demande.</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail. Votre mot de passe actuel ne sera pas modifié.</p>
            <p>Merci,<br>L'équipe de Clinia</p>
        </div>
        <div class="footer">
            <p>Ceci est un e-mail automatique, merci de ne pas y répondre.</p>
            <p>&copy; {{ date('Y') }} Clinia. Tous droits réservés.</p>
            <p>Abomey Calavi, Bénin</p>
        </div>
    </div>
</body>
</html>
