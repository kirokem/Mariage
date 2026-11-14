<?php
/** Section Contact. */
defined('CJ') || exit;
$c = content('contact');
?>
<section id="contact" class="section section--cream" aria-labelledby="contact-titre">
  <div class="wrap wrap--narrow center">
    <header class="section__head reveal">
      <p class="eyebrow"><?= t($c['surtitre']) ?></p>
      <h2 class="section__title" id="contact-titre"><?= t($c['titre']) ?></h2>
      <?php if (filled($c['texte'] ?? '')): ?><p class="section__intro"><?= t($c['texte']) ?></p><?php endif; ?>
    </header>

    <ul class="contacts reveal">
      <?php if (filled($c['email'] ?? '')): ?>
      <li class="contacts__item">
        <span class="contacts__label">E-mail</span>
        <?php if (is_todo($c['email'])): ?>
          <span><?= t($c['email']) ?></span>
        <?php else: ?>
          <a href="mailto:<?= e($c['email']) ?>"><?= e($c['email']) ?></a>
        <?php endif; ?>
      </li>
      <?php endif; ?>
      <?php foreach ($c['personnes'] ?? [] as $p): if (!filled($p['telephone'] ?? '')) continue; ?>
      <li class="contacts__item">
        <span class="contacts__label"><?= t($p['nom']) ?></span>
        <?php if (is_todo($p['telephone'])): ?>
          <span><?= t($p['telephone']) ?></span>
        <?php else: ?>
          <a href="tel:<?= e(preg_replace('/[^0-9+]/', '', $p['telephone'])) ?>"><?= e($p['telephone']) ?></a>
        <?php endif; ?>
      </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
