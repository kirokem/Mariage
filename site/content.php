<?php
/**
 * ============================================================================
 *  CONTENU DU SITE — Charlène & Julien
 * ============================================================================
 *
 *  C'est le SEUL fichier à modifier pour changer les textes du site.
 *  Aucune connaissance en code n'est nécessaire, quelques règles suffisent :
 *
 *   - Ne modifiez que le texte situé ENTRE les apostrophes '…'.
 *   - Pour écrire une apostrophe dans un texte, utilisez l'apostrophe
 *     typographique ’ (ou bien \' ). Exemple : 'l’arrière du château'.
 *   - Chaque ligne se termine par une virgule : ne l'effacez pas.
 *   - Pour qu'une information n'apparaisse pas, mettez '' (deux apostrophes
 *     vides) : la ligne correspondante disparaît du site.
 *
 *  Toutes les informations encore inconnues sont marquées TODO
 *  (qui affiche « [À COMPLÉTER] » sur le site, surligné, pour ne rien
 *  oublier). Remplacez simplement TODO par le texte entre apostrophes,
 *  par exemple :   'heure' => TODO,   devient   'heure' => '11h00',
 *
 *  Astuce : cherchez « TODO » dans ce fichier pour tous les retrouver.
 * ============================================================================
 */

defined('CJ') || exit;

return [

    /* ------------------------------------------------------------------ */
    /*  Informations générales                                            */
    /* ------------------------------------------------------------------ */
    'site' => [
        'maries'      => 'Charlène & Julien',
        'prenom_1'    => 'Charlène',
        'prenom_2'    => 'Julien',
        'dates'       => '11 – 13 juin 2027',
        'dates_long'  => 'Du vendredi 11 au dimanche 13 juin 2027',
        'lieu'        => 'Château des Oliviers de Salettes',
        'region'      => 'Drôme provençale',
        'signature'   => 'Charlène & Julien',
        // Texte de l'onglet du navigateur
        'titre_page'  => 'Charlène & Julien — 11 – 13 juin 2027',
    ],

    /* ------------------------------------------------------------------ */
    /*  Page d'entrée (mot de passe)                                       */
    /* ------------------------------------------------------------------ */
    'entree' => [
        'intro'      => 'Pour découvrir notre site, saisissez le mot de passe indiqué sur votre faire-part.',
        'libelle'    => 'Mot de passe',
        'bouton'     => 'Entrer',
        'erreur'     => 'Ce mot de passe ne semble pas correct. Vérifiez-le sur votre faire-part et réessayez.',
        'trop_essais'=> 'Trop de tentatives d’affilée. Merci de patienter quelques minutes avant de réessayer.',
    ],

    /* ------------------------------------------------------------------ */
    /*  Menu                                                              */
    /* ------------------------------------------------------------------ */
    'menu' => [
        'programme'   => 'Programme',
        'acces'       => 'Accès',
        'hebergement' => 'Hébergement',
        'infos'       => 'Infos pratiques',
        'rsvp'        => 'RSVP',
        'contact'     => 'Contact',
    ],

    /* ------------------------------------------------------------------ */
    /*  Accueil                                                           */
    /* ------------------------------------------------------------------ */
    'accueil' => [
        'surtitre' => 'Nous nous marions',
        'bouton'   => 'Répondre à l’invitation',
    ],

    /* ------------------------------------------------------------------ */
    /*  Photos                                                            */
    /* ------------------------------------------------------------------ */
    // Les photos se placent dans le dossier « photos/ » à la racine du
    // projet, puis se convertissent avec tools/optimize-photos.sh (voir README).
    // Indiquez ici le nom du fichier SANS extension (ex. 'charlene-julien-1'),
    // et une courte description pour les personnes malvoyantes.
    // Laissez '' pour ne pas afficher de photo à cet endroit : la mise en page
    // s'adapte toute seule, sans cadre vide.
    // « recadrer » : true autorise un recadrage panoramique (bandeaux pleine
    // largeur) ; laissez false pour les photos avec des visages.
    'photos' => [
        'accueil'          => ['fichier' => 'chateau',   'description' => 'Le Château des Oliviers de Salettes, sa façade en pierre et sa piscine, entourés de verdure', 'recadrer' => false],
        'apres_programme'  => ['fichier' => 'orangerie', 'description' => 'Vue depuis le domaine sur les champs de lavande et les collines de la Drôme provençale', 'recadrer' => true],
        'hebergement'      => ['fichier' => 'jardin',    'description' => 'La piscine du château et ses toits de tuiles, vus du ciel', 'recadrer' => false],
        'apres_infos'      => ['fichier' => '',          'description' => '', 'recadrer' => false],
    ],

    /* ------------------------------------------------------------------ */
    /*  Programme du week-end                                              */
    /* ------------------------------------------------------------------ */
    'programme' => [
        'surtitre' => 'Le week-end',
        'titre'    => 'Programme',
        'intro'    => 'Trois jours pour nous retrouver, au cœur de la Drôme provençale.',
        'jours'    => [
            [
                'jour'     => 'Vendredi',
                'date'     => '11 juin',
                'theme'    => 'Bienvenue',
                'note'     => 'Arrivée possible dès 16h00',
                'moments'  => [
                    [
                        'titre'    => 'Welcome drink & welcome dinner',
                        'heure'    => '',
                        'lieu'     => 'Dans les jardins, à l’arrière du château',
                        'ambiance' => 'Décontractée, provençale et ensoleillée : l’esprit d’un marché provençal, avec des plats à partager.',
                    ],
                ],
            ],
            [
                'jour'     => 'Samedi',
                'date'     => '12 juin',
                'theme'    => 'Le grand jour',
                'note'     => '',
                'moments'  => [
                    [
                        'titre'    => 'Cérémonie',
                        'heure'    => 'En fin d’après-midi',
                        'lieu'     => 'Dans les jardins, sous les arbres, face à la vue',
                        'ambiance' => 'Romantique, naturelle et sauvage.',
                    ],
                    [
                        'titre'    => 'Cocktail',
                        'heure'    => '',
                        'lieu'     => 'Autour de la piscine',
                        'ambiance' => 'Un verre à la main, le temps de se retrouver.',
                    ],
                    [
                        'titre'    => 'Dîner',
                        'heure'    => '',
                        'lieu'     => 'Devant le château',
                        'ambiance' => 'Romantique, moderne et élégante : un esprit provençal chic, à la lueur des bougies, à la tombée de la nuit.',
                    ],
                ],
            ],
            [
                'jour'     => 'Dimanche',
                'date'     => '13 juin',
                'theme'    => 'Brunch',
                'note'     => '',
                'moments'  => [
                    [
                        'titre'    => 'Brunch',
                        'heure'    => TODO,
                        'lieu'     => TODO,
                        'ambiance' => 'Pour prolonger la fête en douceur, avant de se dire au revoir.',
                    ],
                ],
            ],
        ],
    ],

    /* ------------------------------------------------------------------ */
    /*  Accès                                                             */
    /* ------------------------------------------------------------------ */
    'acces' => [
        'surtitre'  => 'Venir au château',
        'titre'     => 'Accès',
        'adresse'   => [
            'Château des Oliviers de Salettes',
            '1205 Route du Château',
            '26450 Charols, France',
        ],
        'bouton_itineraire' => 'Ouvrir l’itinéraire',
        'lien_itineraire'   => 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x12b56750d862e0b9:0x602e9cc22a7065b1',
        // Blocs d'informations : ajoutez-en ou supprimez-en librement.
        'blocs' => [
            [
                'titre' => 'Parking',
                'texte' => TODO,
            ],
            [
                'titre' => 'Covoiturage',
                'texte' => 'Vous venez en voiture et il vous reste de la place ? Ou vous cherchez quelqu’un avec qui faire la route ? Indiquez-le simplement dans votre réponse au RSVP : nous mettrons en relation celles et ceux qui proposent des places et celles et ceux qui en cherchent.',
            ],
            [
                // Facultatif : supprimez ce bloc s'il ne vous est pas utile.
                'titre' => 'En train ou en avion',
                'texte' => TODO,
            ],
        ],
    ],

    /* ------------------------------------------------------------------ */
    /*  Hébergement                                                       */
    /* ------------------------------------------------------------------ */
    'hebergement' => [
        'surtitre' => 'Dormir sur place',
        'titre'    => 'Hébergement',
        'texte'    => 'Pendant tout le week-end, vous serez nos invités au château : chacune et chacun y sera logé. Nous nous occupons d’attribuer les chambres, vous n’avez rien à réserver.',
        // Détails pratiques, présentés sous forme de liste.
        'details'  => [
            ['libelle' => 'Arrivée (check-in)',  'valeur' => TODO],
            ['libelle' => 'Départ (check-out)',  'valeur' => TODO],
            ['libelle' => 'Bon à savoir',        'valeur' => TODO],
        ],
    ],

    /* ------------------------------------------------------------------ */
    /*  Infos pratiques / FAQ                                             */
    /* ------------------------------------------------------------------ */
    'infos' => [
        'surtitre' => 'Bon à savoir',
        'titre'    => 'Infos pratiques',
        'dress_code' => [
            'question' => 'Dress code',
            'reponse'  => 'Tenue chic. Si le cœur vous en dit, vous pouvez vous inspirer de la palette de notre mariage.',
            // Pastilles de couleur affichées sous la réponse.
            'palette'  => [
                ['nom' => 'Prune',      'couleur' => '#7E3348'],
                ['nom' => 'Vieux rose', 'couleur' => '#B6909D'],
                ['nom' => 'Vert olive', 'couleur' => '#626C4A'],
                ['nom' => 'Sauge',      'couleur' => '#B1B8A8'],
                ['nom' => 'Crème',      'couleur' => '#ECE7E4'],
            ],
        ],
        // Autres questions : ajoutez autant de paires question / réponse
        // que nécessaire. Un saut de ligne vide dans une réponse crée un
        // nouveau paragraphe.
        'questions' => [
            [
                'question' => 'Les enfants',
                'reponse'  => 'Les enfants tiennent une très grande place dans nos cœurs. Pour ce week-end, nous avons pourtant fait le choix d’une célébration entre adultes, à l’exception des enfants de notre famille proche. Nous espérons que vous comprendrez ce choix, et que vous profiterez pleinement de ces quelques jours rien qu’à vous.',
            ],
            [
                'question' => 'Cadeaux',
                'reponse'  => 'Votre présence à nos côtés est le plus beau des cadeaux. Pour celles et ceux qui le souhaiteraient, une urne sera à disposition sur place.',
            ],
            [
                'question' => TODO,
                'reponse'  => TODO,
            ],
        ],
    ],

    /* ------------------------------------------------------------------ */
    /*  RSVP                                                              */
    /* ------------------------------------------------------------------ */
    'rsvp' => [
        'surtitre'      => 'Votre réponse',
        'titre'         => 'RSVP',
        'date_limite'   => TODO, // ex. '15 mars 2027'
        'intro'         => 'Merci de nous répondre avant le {date_limite}. Une seule réponse suffit pour plusieurs personnes : indiquez simplement tous les prénoms et noms concernés.',
        // Dates proposées pour l'arrivée et le départ (format AAAA-MM-JJ => texte affiché)
        'dates' => [
            '2027-06-11' => 'Vendredi 11 juin',
            '2027-06-12' => 'Samedi 12 juin',
            '2027-06-13' => 'Dimanche 13 juin',
        ],
        // Libellés du formulaire
        'formulaire' => [
            'noms'                => 'Prénom(s) et nom(s)',
            'noms_aide'           => 'De toutes les personnes concernées par cette réponse.',
            'email'               => 'E-mail',
            'email_aide'          => 'Pour vous envoyer une confirmation de votre réponse.',
            'presence'            => 'Serez-vous des nôtres ?',
            'presence_oui'        => 'Avec joie, je serai / nous serons là',
            'presence_non'        => 'Malheureusement, je ne pourrai / nous ne pourrons pas venir',
            'regime'              => 'Régime alimentaire, allergies ou intolérances',
            'regime_aide'         => 'Facultatif. Précisez pour qui, le cas échéant.',
            'arrivee'             => 'Date d’arrivée',
            'depart'              => 'Date de départ',
            'transport'           => 'Moyen de transport',
            'transport_options'   => [
                'voiture' => 'Voiture',
                'train'   => 'Train',
                'avion'   => 'Avion',
                'autre'   => 'Autre',
            ],
            'transport_precision' => 'Précisez',
            'covoiturage'         => 'Covoiturage',
            'covoiturage_options' => [
                'propose' => 'Je propose des places',
                'cherche' => 'Je cherche une place',
                'non'     => 'Non merci',
            ],
            'covoit_ville'        => 'Ville de départ',
            'covoit_places'       => 'Nombre de places disponibles',
            'message'             => 'Un petit mot pour les mariés',
            'message_aide'        => 'Facultatif.',
            'obligatoire'         => 'obligatoire',
            'bouton'              => 'Envoyer ma réponse',
            'envoi_en_cours'      => 'Envoi en cours…',
        ],
        'merci_oui'     => 'Merci, votre réponse a bien été envoyée ! Nous avons hâte de vous retrouver en juin. Un e-mail de confirmation vient de partir vers votre adresse.',
        'merci_non'     => 'Merci, votre réponse a bien été envoyée. Vous nous manquerez ; nous penserons à vous. Un e-mail de confirmation vient de partir vers votre adresse.',
        'erreur_envoi'  => 'Nous sommes désolés, votre réponse n’a pas pu être envoyée pour une raison technique. Merci de réessayer dans quelques instants, ou de nous écrire directement (voir « Contact » ci-dessous).',
        'erreur_champs' => 'Certaines informations sont manquantes ou incomplètes. Merci de vérifier les champs signalés.',
        'erreur_limite' => 'Vous avez déjà envoyé plusieurs réponses en peu de temps. Merci de patienter un peu avant de réessayer, ou de nous écrire directement.',
        'erreur_session'=> 'Votre page est restée ouverte longtemps. Merci de la recharger, puis de renvoyer votre réponse.',
        // Texte de l'accusé de réception envoyé à l'invité (avant le récapitulatif)
        'email_invite_oui' => "Merci pour votre réponse : nous sommes tellement heureux de savoir que vous serez des nôtres !\n\nVoici un récapitulatif de ce que vous nous avez indiqué. Si quelque chose change d’ici là, il suffit de renvoyer le formulaire ou de répondre à cet e-mail.\n\nNous avons hâte de vous retrouver en Drôme provençale.",
        'email_invite_non' => "Merci d’avoir pris le temps de nous répondre. Nous sommes tristes de ne pas vous avoir à nos côtés, mais nous penserons bien à vous ce week-end-là.\n\nSi jamais vos plans changeaient, il suffit de renvoyer le formulaire ou de répondre à cet e-mail.",
    ],

    /* ------------------------------------------------------------------ */
    /*  Contact                                                           */
    /* ------------------------------------------------------------------ */
    'contact' => [
        'surtitre' => 'Une question ?',
        'titre'    => 'Contact',
        'texte'    => 'Pour toute question, n’hésitez pas à nous écrire ou à nous appeler.',
        'email'    => TODO,
        'personnes' => [
            ['nom' => 'Charlène', 'telephone' => TODO],
            ['nom' => 'Julien',   'telephone' => TODO],
        ],
    ],

    /* ------------------------------------------------------------------ */
    /*  Pied de page                                                      */
    /* ------------------------------------------------------------------ */
    'pied' => [
        'texte' => 'Avec toute notre affection',
    ],
];
