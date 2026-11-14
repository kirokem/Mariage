<?php
/**
 * Sécurité générale : en-têtes HTTP, détection HTTPS, adresse IP,
 * contrôle d'origine des formulaires.
 */

defined('CJ') || exit;

/** Nonce aléatoire par requête, autorisant uniquement nos <style> en ligne. */
function csp_nonce(): string
{
    static $nonce = null;
    return $nonce ??= base64_encode(random_bytes(16));
}

/** Vrai si la requête est en HTTPS (y compris derrière le proxy Infomaniak). */
function is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['SERVER_PORT'] ?? '') === '443')
        || (strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
}

/** Adresse IP du visiteur (utilisée uniquement pour limiter les abus). */
function client_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

/** Chemin du site (racine ou sous-dossier), pour le cookie de connexion. */
function base_path(): string
{
    $dir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/'));
    return rtrim($dir, '/') . '/';
}

/**
 * Refuse les formulaires envoyés depuis un autre site (complément du jeton
 * CSRF). Les navigateurs récents envoient toujours l'en-tête Origin en POST.
 */
function same_origin(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '' || $origin === 'null') {
        // Pas d'Origin (ancien navigateur) : on se rabat sur le Referer s'il existe.
        $origin = $_SERVER['HTTP_REFERER'] ?? '';
        if ($origin === '') {
            return true; // le jeton CSRF reste la protection principale
        }
    }
    $host     = (string) parse_url($origin, PHP_URL_HOST);
    $expected = preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? ''));
    return $host !== '' && strcasecmp($host, $expected) === 0;
}

/** Envoie les en-têtes de sécurité communs à toutes les réponses. */
function send_security_headers(): void
{
    header_remove('X-Powered-By');
    header('X-Robots-Tag: noindex, nofollow, noarchive');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: same-origin');
    header('X-Frame-Options: DENY');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()');
    header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'nonce-" . csp_nonce() . "'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'");
    if (is_https()) {
        header('Strict-Transport-Security: max-age=31536000');
    }
    // Pages personnelles : pas de cache partagé.
    header('Cache-Control: private, no-cache, must-revalidate');
}
