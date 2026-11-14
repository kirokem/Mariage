<?php
/**
 * Accès protégé par mot de passe commun.
 *
 * Fonctionnement : quand l'invité saisit le bon mot de passe (vérifié avec
 * password_verify contre le hash de config.php), le serveur lui remet un
 * cookie signé (HMAC-SHA256 avec la clé secrète) valable plusieurs semaines.
 * À chaque visite, PHP revérifie cette signature côté serveur.
 *
 * Pourquoi un cookie signé plutôt qu'une simple session PHP ? Sur un
 * hébergement mutualisé, les fichiers de session sont effacés au bout de
 * quelques heures : les invités devraient retaper le code. Le cookie signé,
 * lui, ne dépend d'aucun fichier sur le serveur.
 *
 * Changer le mot de passe (donc son hash) ou la clé secrète invalide
 * automatiquement tous les cookies existants.
 */

defined('CJ') || exit;

const AUTH_COOKIE = 'cj_acces';

/** Signature HMAC liée à la clé secrète ET au hash du mot de passe actuel. */
function auth_sign(string $data): string
{
    return hash_hmac('sha256', $data . '|' . config('password_hash'), config('secret_key'));
}

/** Vrai si le visiteur possède un cookie d'accès valide. */
function is_authenticated(): bool
{
    $cookie = $_COOKIE[AUTH_COOKIE] ?? '';
    if (!preg_match('/^(\d{10})\.([a-f0-9]{64})$/', $cookie, $m)) {
        return false;
    }
    $expires = (int) $m[1];
    return $expires > time() && hash_equals(auth_sign('acces|' . $expires), $m[2]);
}

/** Vérifie le mot de passe et, s'il est correct, dépose le cookie d'accès. */
function auth_login(string $password): bool
{
    if ($password === '' || !password_verify($password, config('password_hash'))) {
        return false;
    }
    $expires = time() + 86400 * max(1, (int) config('auth_days', 60));
    $value   = $expires . '.' . auth_sign('acces|' . $expires);
    setcookie(AUTH_COOKIE, $value, [
        'expires'  => $expires,
        'path'     => base_path(),
        'secure'   => is_https(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    $_COOKIE[AUTH_COOKIE] = $value;
    return true;
}

/* ---------------------------------------------------------------------- */
/*  Jeton anti-CSRF                                                        */
/* ---------------------------------------------------------------------- */
/*
 * Le jeton contient l'heure d'affichage du formulaire et une signature liée
 * au cookie d'accès de l'invité : un site tiers ne peut donc pas le deviner.
 * L'heure sert aussi de piège anti-robot (envoi trop rapide = robot).
 */

function csrf_token(): string
{
    $ts = (string) time();
    return $ts . '.' . auth_sign('csrf|' . ($_COOKIE[AUTH_COOKIE] ?? '') . '|' . $ts);
}

/**
 * Vérifie un jeton. Renvoie l'âge du jeton en secondes, ou null s'il est
 * invalide ou expiré.
 */
function csrf_check(string $token): ?int
{
    if (!preg_match('/^(\d{10})\.([a-f0-9]{64})$/', $token, $m)) {
        return null;
    }
    $expected = auth_sign('csrf|' . ($_COOKIE[AUTH_COOKIE] ?? '') . '|' . $m[1]);
    if (!hash_equals($expected, $m[2])) {
        return null;
    }
    $age = time() - (int) $m[1];
    // Valable 7 jours : un invité peut laisser l'onglet ouvert longtemps.
    return ($age >= 0 && $age <= 7 * 86400) ? $age : null;
}
