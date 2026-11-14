<?php
/**
 * RSVP : validation des réponses et préparation des e-mails.
 */

defined('CJ') || exit;

/** Nettoie une saisie texte : supprime les caractères de contrôle, limite la longueur. */
function clean_text($value, int $max, bool $multiline = false): string
{
    $value = is_string($value) ? $value : '';
    $value = str_replace("\r\n", "\n", $value);
    $value = $multiline
        ? preg_replace('/[^\P{C}\n]/u', '', $value)   // garde uniquement les retours à la ligne
        : preg_replace('/\p{C}+/u', ' ', $value);     // aucune commande, aucun retour à la ligne
    $value = trim((string) $value);
    return mb_substr($value, 0, $max);
}

/**
 * Valide les données envoyées.
 *
 * @return array{0: array, 1: array} [données propres, erreurs par champ]
 */
function rsvp_validate(array $in): array
{
    $c      = content('rsvp');
    $dates  = array_keys($c['dates'] ?? []);
    $tr     = array_keys($c['formulaire']['transport_options'] ?? []);
    $co     = array_keys($c['formulaire']['covoiturage_options'] ?? []);
    $d      = [];
    $err    = [];

    $d['noms'] = clean_text($in['noms'] ?? '', 300);
    if (mb_strlen($d['noms']) < 2) {
        $err['noms'] = 'Merci d’indiquer vos prénom(s) et nom(s).';
    }

    $d['email'] = clean_text($in['email'] ?? '', 254);
    if (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) {
        $err['email'] = 'Merci d’indiquer une adresse e-mail valide.';
    }

    $d['presence'] = in_array($in['presence'] ?? '', ['oui', 'non'], true) ? $in['presence'] : '';
    if ($d['presence'] === '') {
        $err['presence'] = 'Merci de nous dire si vous serez présent(s).';
    }

    if ($d['presence'] === 'oui') {
        $d['regime'] = clean_text($in['regime'] ?? '', 1000, true);

        $d['arrivee'] = in_array($in['arrivee'] ?? '', $dates, true) ? $in['arrivee'] : '';
        $d['depart']  = in_array($in['depart'] ?? '', $dates, true) ? $in['depart'] : '';
        if ($d['arrivee'] === '') {
            $err['arrivee'] = 'Merci de choisir votre date d’arrivée.';
        }
        if ($d['depart'] === '') {
            $err['depart'] = 'Merci de choisir votre date de départ.';
        } elseif ($d['arrivee'] !== '' && $d['depart'] < $d['arrivee']) {
            $err['depart'] = 'La date de départ ne peut pas précéder la date d’arrivée.';
        }

        $d['transport'] = in_array($in['transport'] ?? '', $tr, true) ? $in['transport'] : '';
        if ($d['transport'] === '') {
            $err['transport'] = 'Merci de choisir votre moyen de transport.';
        }
        $d['transport_precision'] = $d['transport'] === 'autre'
            ? clean_text($in['transport_precision'] ?? '', 150) : '';

        $d['covoiturage'] = in_array($in['covoiturage'] ?? '', $co, true) ? $in['covoiturage'] : '';
        if ($d['covoiturage'] === '') {
            $err['covoiturage'] = 'Merci de répondre à la question du covoiturage.';
        }
        $d['covoit_ville']  = '';
        $d['covoit_places'] = '';
        if (in_array($d['covoiturage'], ['propose', 'cherche'], true)) {
            $d['covoit_ville'] = clean_text($in['covoit_ville'] ?? '', 120);
            if (mb_strlen($d['covoit_ville']) < 2) {
                $err['covoit_ville'] = 'Merci d’indiquer votre ville de départ.';
            }
        }
        if ($d['covoiturage'] === 'propose') {
            $places = filter_var($in['covoit_places'] ?? '', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 8]]);
            if ($places === false) {
                $err['covoit_places'] = 'Merci d’indiquer un nombre de places entre 1 et 8.';
            } else {
                $d['covoit_places'] = (string) $places;
            }
        }
    }

    $d['message'] = clean_text($in['message'] ?? '', 2000, true);

    return [$d, $err];
}

/** Récapitulatif lisible : liste de [libellé, valeur]. */
function rsvp_summary(array $d): array
{
    $c = content('rsvp');
    $f = $c['formulaire'];
    $rows = [
        [$f['noms'], $d['noms']],
        [$f['email'], $d['email']],
        ['Présence', $d['presence'] === 'oui' ? $f['presence_oui'] : $f['presence_non']],
    ];
    if ($d['presence'] === 'oui') {
        $transport = $f['transport_options'][$d['transport']] ?? '';
        if ($d['transport_precision'] !== '') {
            $transport .= ' (' . $d['transport_precision'] . ')';
        }
        $covoit = $f['covoiturage_options'][$d['covoiturage']] ?? '';
        if ($d['covoiturage'] === 'propose') {
            $covoit .= ' : ' . $d['covoit_places'] . ' place(s), au départ de ' . $d['covoit_ville'];
        } elseif ($d['covoiturage'] === 'cherche') {
            $covoit .= ', au départ de ' . $d['covoit_ville'];
        }
        $rows[] = [$f['arrivee'], $c['dates'][$d['arrivee']] ?? ''];
        $rows[] = [$f['depart'], $c['dates'][$d['depart']] ?? ''];
        $rows[] = [$f['transport'], $transport];
        $rows[] = [$f['covoiturage'], $covoit];
        $rows[] = ['Régime / allergies', $d['regime'] !== '' ? $d['regime'] : '—'];
    }
    $rows[] = ['Petit mot', $d['message'] !== '' ? $d['message'] : '—'];
    return $rows;
}

/** Corps texte brut d'un e-mail. */
function rsvp_text(string $intro, array $rows, string $outro = ''): string
{
    $txt = $intro . "\n\n";
    foreach ($rows as [$label, $value]) {
        $txt .= mb_strtoupper($label) . "\n" . $value . "\n\n";
    }
    return rtrim($txt . $outro) . "\n";
}

/** Corps HTML d'un e-mail (styles en ligne, compatibles avec les messageries). */
function rsvp_html(string $title, string $intro, array $rows, string $outro = ''): string
{
    ob_start();
    include CJ_ROOT . '/inc/views/emails/layout.php';
    return (string) ob_get_clean();
}

/**
 * Envoie les deux e-mails. Renvoie true si l'e-mail aux mariés est parti
 * (l'accusé de réception à l'invité est un plus : son échec est consigné
 * mais ne fait pas échouer la réponse).
 */
function rsvp_send(array $d): bool
{
    require_once CJ_ROOT . '/inc/mailer.php';
    $site  = content('site');
    $c     = content('rsvp');
    $rows  = rsvp_summary($d);
    $nom   = preg_replace('/\s+/u', ' ', $d['noms']);
    $vient = $d['presence'] === 'oui';

    // 1. E-mail aux mariés
    $subject = 'RSVP — ' . $nom . ' — ' . ($vient ? 'Présent(s)' : 'Absent(s)');
    $intro   = $vient
        ? $nom . ' a répondu présent pour le mariage.'
        : $nom . ' ne pourra malheureusement pas venir.';
    $intro  .= "\nRépondez directement à cet e-mail pour lui écrire.";
    try {
        send_mail(
            (array) config('rsvp_recipients', []),
            $subject,
            rsvp_html('Nouvelle réponse', $intro, $rows),
            rsvp_text($intro, $rows),
            $d['email'],
            $nom
        );
    } catch (\Throwable $ex) {
        log_error('RSVP mariés : ' . $ex->getMessage());
        return false;
    }

    // 2. Accusé de réception à l'invité
    $intro = $vient ? $c['email_invite_oui'] : $c['email_invite_non'];
    $outro = "Avec toute notre affection,\n" . $site['signature'];
    try {
        send_mail(
            [$d['email']],
            'Merci pour votre réponse — ' . $site['maries'],
            rsvp_html('Merci ' . $nom, $intro, $rows, $outro),
            rsvp_text($intro, $rows, $outro),
            // Si l'invité répond à l'accusé de réception, sa réponse arrive aux mariés.
            ((array) config('rsvp_recipients', []))[0] ?? null,
            $site['maries']
        );
    } catch (\Throwable $ex) {
        log_error('RSVP accusé de réception : ' . $ex->getMessage());
    }
    return true;
}
