<?php
/**
 * ============================================================================
 *  CONFIGURATION SENSIBLE — modèle
 * ============================================================================
 *
 *  1. Copiez ce fichier sous le nom « config.php » (dans le même dossier).
 *  2. Remplissez les valeurs ci-dessous (voir README.md).
 *  3. Ne versionnez JAMAIS config.php (il est déjà exclu par .gitignore).
 * ============================================================================
 */

defined('CJ') || exit;

return [

    /* -------------------------------------------------------------- */
    /*  Accès au site                                                  */
    /* -------------------------------------------------------------- */

    // Hash du mot de passe imprimé sur le faire-part.
    // Pour le générer :  php tools/hash-password.php
    // (ne mettez JAMAIS le mot de passe en clair ici)
    'password_hash' => '',

    // Clé secrète aléatoire servant à signer le cookie de connexion et les
    // jetons anti-CSRF. 64 caractères hexadécimaux, générés par :
    //   php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
    // La changer déconnecte tous les invités.
    'secret_key' => '',

    // Durée pendant laquelle un invité reste connecté (en jours).
    'auth_days' => 60,

    /* -------------------------------------------------------------- */
    /*  Envoi des e-mails (SMTP Infomaniak)                            */
    /* -------------------------------------------------------------- */
    'smtp' => [
        'host'       => 'mail.infomaniak.com',
        'port'       => 465,          // 465 (SSL) ou 587 (STARTTLS)
        'encryption' => 'ssl',        // 'ssl' pour 465, 'tls' pour 587
        'username'   => '',           // adresse e-mail complète du compte d'envoi
        'password'   => '',           // mot de passe de cette adresse e-mail
        'timeout'    => 15,
    ],

    // Expéditeur des e-mails (doit être l'adresse du compte SMTP ci-dessus,
    // sinon Infomaniak refuse l'envoi ou les e-mails partent en spam).
    'from_email' => '',
    'from_name'  => 'Charlène & Julien',

    // Adresse(s) qui reçoivent les réponses RSVP.
    'rsvp_recipients' => [
        // 'adresse@exemple.ch',
    ],

    /* -------------------------------------------------------------- */
    /*  Anti-abus                                                      */
    /* -------------------------------------------------------------- */
    'limits' => [
        'rsvp_max'     => 5,     // nombre maximum d'envois RSVP…
        'rsvp_window'  => 3600,  // …par adresse IP sur cette durée (secondes)
        'login_max'    => 10,    // tentatives de mot de passe…
        'login_window' => 900,   // …par adresse IP sur cette durée (secondes)
    ],

    // Mode test : true affiche les erreurs techniques détaillées.
    // À laisser sur false en production.
    'debug' => false,
];
