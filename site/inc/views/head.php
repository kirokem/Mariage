<?php
/** En-tête HTML commun (page d'entrée et site). Variable : $pageTitle. */
defined('CJ') || exit;
$site = content('site');
?>
<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($pageTitle ?? $site['titre_page']) ?></title>
<meta name="description" content="<?= e($site['maries'] . ' · ' . $site['dates_long'] . ' · ' . $site['lieu']) ?>">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="referrer" content="same-origin">
<meta name="theme-color" content="#7E3348">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="favicon.ico" sizes="32x32">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preload" href="assets/fonts/bebas-neue-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/inter-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="<?= asset('assets/css/site.css') ?>">
<script src="<?= asset('assets/js/site.js') ?>" defer></script>
<?php if (!empty($inlineStyle)): ?>
<style nonce="<?= e(csp_nonce()) ?>"><?= $inlineStyle ?></style>
<?php endif; ?>
</head>
