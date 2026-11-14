<?php
/**
 * Point d'entrée du site.
 * - Visiteur non connecté : page d'entrée avec le mot de passe du faire-part.
 * - Visiteur connecté     : le site complet (une seule page).
 */

require __DIR__ . '/inc/bootstrap.php';
send_security_headers();

if (!is_authenticated()) {
    $gateError = '';
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
        $entree = content('entree');
        $limits = config('limits', []);
        $max    = (int) ($limits['login_max'] ?? 10);
        $window = (int) ($limits['login_window'] ?? 900);

        if (rl_exceeded('login', $max, $window)) {
            http_response_code(429);
            $gateError = $entree['trop_essais'];
        } elseif (same_origin() && auth_login((string) ($_POST['mot_de_passe'] ?? ''))) {
            // Connexion réussie : on recharge la page en GET.
            header('Location: ' . base_path(), true, 303);
            exit;
        } else {
            rl_add('login', $window); // seuls les échecs sont comptés
            http_response_code(401);
            $gateError = $entree['erreur'];
        }
    }
    include __DIR__ . '/inc/views/gate.php';
    exit;
}

// Retour après un envoi RSVP sans JavaScript (redirection depuis rsvp.php)
$rsvp = ['state' => 'form', 'data' => [], 'errors' => [], 'message' => ''];
$retour = $_GET['rsvp'] ?? '';
if ($retour === 'oui' || $retour === 'non') {
    $rsvp['state']   = 'success';
    $rsvp['message'] = content('rsvp')[$retour === 'oui' ? 'merci_oui' : 'merci_non'];
}

include __DIR__ . '/inc/views/page.php';
