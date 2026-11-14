<?php
/**
 * Amorçage commun à toutes les pages : configuration, contenu, fonctions
 * utilitaires et en-têtes de sécurité.
 */

define('CJ', true);
define('CJ_ROOT', dirname(__DIR__));
define('TODO', '[À COMPLÉTER]');

mb_internal_encoding('UTF-8');
date_default_timezone_set('Europe/Zurich');

/* ---------------------------------------------------------------------- */
/*  Configuration                                                          */
/* ---------------------------------------------------------------------- */

if (!is_file(CJ_ROOT . '/config.php')) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    exit("Site en cours d'installation : le fichier config.php est manquant (voir README.md).");
}

$CONFIG  = require CJ_ROOT . '/config.php';
$CONTENT = require CJ_ROOT . '/content.php';

if (empty($CONFIG['password_hash']) || strlen((string) ($CONFIG['secret_key'] ?? '')) < 32) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    exit("Site en cours d'installation : renseignez password_hash et secret_key dans config.php (voir README.md).");
}

if (!empty($CONFIG['debug'])) {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
}

/** Lit une valeur de configuration avec une valeur par défaut. */
function config(string $key, $default = null)
{
    global $CONFIG;
    return $CONFIG[$key] ?? $default;
}

/** Lit une section du contenu éditable. */
function content(string $key): array
{
    global $CONTENT;
    return $CONTENT[$key] ?? [];
}

require __DIR__ . '/security.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/ratelimit.php';

/* ---------------------------------------------------------------------- */
/*  Échappement et mise en forme                                           */
/* ---------------------------------------------------------------------- */

/** Échappe une valeur pour l'affichage HTML. */
function e($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Indique si un texte contient encore un marqueur [À COMPLÉTER]. */
function is_todo($value): bool
{
    return is_string($value) && str_contains($value, TODO);
}

/**
 * Échappe un texte et met en évidence les marqueurs [À COMPLÉTER],
 * pour qu'ils sautent aux yeux tant qu'ils ne sont pas remplacés.
 */
function t($value): string
{
    return str_replace(e(TODO), '<mark class="todo">' . e(TODO) . '</mark>', e($value));
}

/** Transforme un texte (paragraphes séparés par une ligne vide) en <p>. */
function paras(string $text, string $class = ''): string
{
    $out = '';
    $attr = $class !== '' ? ' class="' . e($class) . '"' : '';
    foreach (preg_split('/\R\s*\R/u', trim($text)) as $p) {
        $out .= '<p' . $attr . '>' . nl2br(t(trim($p)), false) . '</p>';
    }
    return $out;
}

/** Vrai si une valeur doit être affichée (non vide). */
function filled($value): bool
{
    return is_string($value) ? trim($value) !== '' : !empty($value);
}

/* ---------------------------------------------------------------------- */
/*  Photos                                                                 */
/* ---------------------------------------------------------------------- */

/**
 * Affiche une photo responsive (WebP multi-tailles générées par
 * tools/optimize-photos.sh). Si la photo n'existe pas, ne renvoie rien :
 * aucune case vide n'apparaît sur le site.
 *
 * @param string $key    clé dans content.php > photos
 * @param string $sizes  attribut sizes
 * @param bool   $eager  true pour la photo principale (chargée tout de suite)
 */
function photo(string $key, string $sizes, bool $eager = false): string
{
    $p = content('photos')[$key] ?? null;
    $name = is_array($p) ? preg_replace('/[^a-z0-9_-]/i', '', (string) ($p['fichier'] ?? '')) : '';
    if ($name === '') {
        return '';
    }
    $files = glob(CJ_ROOT . '/assets/photos/' . $name . '-*.webp') ?: [];
    $variants = [];
    foreach ($files as $file) {
        if (preg_match('/-(\d+)\.webp$/', $file, $m)) {
            $variants[(int) $m[1]] = $file;
        }
    }
    if (!$variants) {
        return '';
    }
    ksort($variants);
    $srcset = [];
    foreach ($variants as $w => $file) {
        $srcset[] = 'assets/photos/' . rawurlencode(basename($file)) . ' ' . $w . 'w';
    }
    // Taille par défaut : la variante ≥ 960 px la plus proche, sinon la plus grande.
    $default = end($variants);
    foreach ($variants as $w => $file) {
        if ($w >= 960) { $default = $file; break; }
    }
    [$width, $height] = @getimagesize($default) ?: [0, 0];

    return sprintf(
        '<img src="%s" srcset="%s" sizes="%s" width="%d" height="%d" alt="%s" decoding="async" %s>',
        e('assets/photos/' . basename($default)),
        e(implode(', ', $srcset)),
        e($sizes),
        $width,
        $height,
        e($p['description'] ?? ''),
        $eager ? 'fetchpriority="high"' : 'loading="lazy"'
    );
}

/** Ajoute un horodatage aux fichiers statiques pour invalider le cache. */
function asset(string $path): string
{
    $file = CJ_ROOT . '/' . $path;
    return e($path . (is_file($file) ? '?v=' . filemtime($file) : ''));
}
