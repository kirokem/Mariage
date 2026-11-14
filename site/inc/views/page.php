<?php
/**
 * Page principale du site (une seule page, navigation par ancres).
 * Variable : $rsvp (état du formulaire : 'state', 'data', 'errors', 'message').
 */
defined('CJ') || exit;
$site = content('site');
$menu = content('menu');

// Pastilles de couleur du dress code : couleurs lues dans content.php,
// injectées dans un <style> autorisé par la politique de sécurité (nonce).
$inlineStyle = '';
foreach (content('infos')['dress_code']['palette'] ?? [] as $i => $color) {
    if (preg_match('/^#[0-9a-f]{3,8}$/i', $color['couleur'] ?? '')) {
        $inlineStyle .= '.swatch--' . $i . '{--swatch:' . $color['couleur'] . '}';
    }
}
include __DIR__ . '/head.php';
?>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>

<header class="nav" data-nav>
  <div class="nav__inner">
    <a class="nav__brand" href="#accueil">C&amp;J<span class="sr-only"> : <?= e($site['maries']) ?>, retour en haut</span></a>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="menu" data-nav-toggle>
      <span class="sr-only">Menu</span>
      <span class="burger" aria-hidden="true"><span></span><span></span></span>
    </button>
    <nav class="nav__menu" id="menu" aria-label="Navigation principale">
      <ul>
        <?php foreach ($menu as $anchor => $label): ?>
          <li><a href="#<?= e($anchor) ?>"><?= e($label) ?></a></li>
        <?php endforeach; ?>
      </ul>
    </nav>
  </div>
</header>

<main id="contenu" tabindex="-1">
  <?php
  include __DIR__ . '/sections/accueil.php';
  include __DIR__ . '/sections/programme.php';
  if ($img = photo('apres_programme', '(min-width: 64em) 60rem, 100vw')) {
      echo '<figure class="interlude reveal">' . $img . '</figure>';
  }
  include __DIR__ . '/sections/acces.php';
  include __DIR__ . '/sections/hebergement.php';
  include __DIR__ . '/sections/infos.php';
  if ($img = photo('apres_infos', '(min-width: 64em) 60rem, 100vw')) {
      echo '<figure class="interlude reveal">' . $img . '</figure>';
  }
  include __DIR__ . '/sections/rsvp.php';
  include __DIR__ . '/sections/contact.php';
  ?>
</main>

<footer class="footer">
  <p class="footer__text"><?= t(content('pied')['texte'] ?? '') ?></p>
  <p class="footer__sign"><?= e($site['signature']) ?></p>
  <p class="footer__meta"><?= e($site['dates']) ?> · <?= e($site['lieu']) ?></p>
</footer>
</body>
</html>
