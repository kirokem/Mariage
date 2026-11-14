<?php
/**
 * Réception du formulaire RSVP.
 *
 * - Requête JavaScript (fetch) : réponse JSON, la page ne se recharge pas.
 * - Requête classique (sans JavaScript) : redirection vers la page avec un
 *   message, ou réaffichage du formulaire avec les erreurs.
 *
 * Aucune donnée n'est stockée : tout part par e-mail.
 */

require __DIR__ . '/inc/bootstrap.php';
require __DIR__ . '/inc/rsvp.php';
send_security_headers();

$isAjax = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
$texts  = content('rsvp');

/** Termine la requête avec un résultat (JSON ou page HTML). */
function respond(int $status, string $state, string $message, array $data = [], array $errors = [], string $presence = ''): void
{
    global $isAjax;
    http_response_code($status);
    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $state === 'success', 'message' => $message, 'errors' => (object) $errors], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if ($state === 'success') {
        header('Location: ' . base_path() . '?rsvp=' . ($presence === 'non' ? 'non' : 'oui') . '#rsvp', true, 303);
        exit;
    }
    $rsvp = ['state' => $state, 'data' => $data, 'errors' => $errors, 'message' => $message];
    include CJ_ROOT . '/inc/views/page.php';
    exit;
}

// Accès réservé aux invités connectés, en POST uniquement.
if (!is_authenticated()) {
    if ($isAjax) {
        respond(401, 'error', $texts['erreur_session']);
    }
    header('Location: ' . base_path(), true, 303);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: ' . base_path() . '#rsvp', true, 303);
    exit;
}

// 1. Jeton anti-CSRF et origine de la requête
$age = csrf_check((string) ($_POST['jeton'] ?? ''));
if ($age === null || !same_origin()) {
    respond(403, 'error', $texts['erreur_session']);
}

// 2. Piège anti-robots : champ caché rempli ou formulaire envoyé en moins
//    de 3 secondes. On fait comme si tout allait bien, sans rien envoyer.
if (trim((string) ($_POST['site_web'] ?? '')) !== '' || $age < 3) {
    $non = ($_POST['presence'] ?? '') === 'non';
    respond(200, 'success', $texts[$non ? 'merci_non' : 'merci_oui'], [], [], $non ? 'non' : 'oui');
}

// 3. Validation côté serveur
[$data, $errors] = rsvp_validate($_POST);
if ($errors) {
    respond(422, 'error', $texts['erreur_champs'], $data, $errors);
}

// 4. Limitation du nombre d'envois par adresse IP
$limits = config('limits', []);
$max    = (int) ($limits['rsvp_max'] ?? 5);
$window = (int) ($limits['rsvp_window'] ?? 3600);
if (rl_exceeded('rsvp', $max, $window)) {
    respond(429, 'error', $texts['erreur_limite'], $data);
}
rl_add('rsvp', $window);

// 5. Envoi des e-mails
if (!rsvp_send($data)) {
    respond(500, 'error', $texts['erreur_envoi'], $data);
}

respond(200, 'success', $texts[$data['presence'] === 'oui' ? 'merci_oui' : 'merci_non'], [], [], $data['presence']);
