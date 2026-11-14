<?php
/**
 * Limitation du nombre d'actions par adresse IP (envois RSVP, essais de
 * mot de passe). Aucune base de données : un petit fichier JSON par IP et
 * par type d'action dans storage/ratelimit/, protégé par .htaccess.
 * Les adresses IP sont hachées : elles ne sont jamais écrites en clair.
 */

defined('CJ') || exit;

function rl_file(string $bucket): string
{
    $dir = CJ_ROOT . '/storage/ratelimit';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $id = hash_hmac('sha256', $bucket . '|' . client_ip(), (string) config('secret_key'));
    return $dir . '/' . $bucket . '-' . substr($id, 0, 40) . '.json';
}

/** Horodatages encore dans la fenêtre de temps. */
function rl_read(string $file, int $window): array
{
    $raw  = is_file($file) ? @file_get_contents($file) : '';
    $hits = json_decode($raw ?: '[]', true);
    $min  = time() - $window;
    return array_values(array_filter(is_array($hits) ? $hits : [], fn ($t) => is_int($t) && $t > $min));
}

/** Vrai si la limite est atteinte (sans enregistrer de nouvelle action). */
function rl_exceeded(string $bucket, int $max, int $window): bool
{
    return count(rl_read(rl_file($bucket), $window)) >= $max;
}

/** Enregistre une action. */
function rl_add(string $bucket, int $window): void
{
    $file = rl_file($bucket);
    $fp = @fopen($file, 'c+');
    if (!$fp) {
        return; // stockage indisponible : on ne bloque pas les invités
    }
    flock($fp, LOCK_EX);
    $hits   = rl_read($file, $window);
    $hits[] = time();
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($hits));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    // Ménage occasionnel des fichiers de plus de 2 jours.
    if (random_int(1, 50) === 1) {
        foreach (glob(dirname($file) . '/*.json') ?: [] as $old) {
            if (filemtime($old) < time() - 172800) {
                @unlink($old);
            }
        }
    }
}
