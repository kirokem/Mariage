<?php
/**
 * Génère le hash du mot de passe du site, à copier dans config.php.
 *
 * Utilisation (dans un terminal, à la racine du projet) :
 *     php tools/hash-password.php
 * Le mot de passe est demandé sans être affiché à l'écran.
 */

if (PHP_SAPI !== 'cli') {
    exit("À lancer en ligne de commande uniquement.\n");
}

fwrite(STDOUT, 'Mot de passe du faire-part : ');
$hidden = DIRECTORY_SEPARATOR === '/' && @shell_exec('stty -echo 2>/dev/null') !== null;
$password = rtrim((string) fgets(STDIN), "\r\n");
if ($hidden) {
    @shell_exec('stty echo 2>/dev/null');
    fwrite(STDOUT, PHP_EOL);
}

if ($password === '') {
    fwrite(STDERR, "Mot de passe vide : abandon.\n");
    exit(1);
}

echo PHP_EOL, "Copiez cette ligne dans site/config.php :", PHP_EOL, PHP_EOL;
echo "    'password_hash' => '", password_hash($password, PASSWORD_DEFAULT), "',", PHP_EOL, PHP_EOL;
echo "Et, si ce n'est pas déjà fait, une clé secrète :", PHP_EOL, PHP_EOL;
echo "    'secret_key' => '", bin2hex(random_bytes(32)), "',", PHP_EOL, PHP_EOL;
