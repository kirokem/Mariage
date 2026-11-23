<?php
/** Section Accès. */
defined('CJ') || exit;
$a = content('acces');
?>
<section id="acces" class="section section--cream" aria-labelledby="acces-titre">
  <div class="wrap">
    <header class="section__head reveal">
      <h2 class="section__title" id="acces-titre"><?= t($a['titre']) ?></h2>
    </header>

    <div class="split">
      <div class="split__main reveal">
        <address class="address">
          <?php foreach ($a['adresse'] as $i => $line): ?>
            <span class="<?= $i === 0 ? 'address__name' : '' ?>"><?= t($line) ?></span>
          <?php endforeach; ?>
        </address>
        <?php if (filled($a['lien_itineraire'] ?? '')): ?>
          <a class="btn" href="<?= e($a['lien_itineraire']) ?>" target="_blank" rel="noopener noreferrer">
            <?= t($a['bouton_itineraire']) ?><span class="sr-only"> (ouvre Google Maps dans un nouvel onglet)</span>
            <span class="btn__arrow" aria-hidden="true"></span>
          </a>
        <?php endif; ?>
      </div>

      <div class="split__side">
        <?php foreach ($a['blocs'] as $bloc): ?>
          <div class="info reveal">
            <h3 class="info__title"><?= t($bloc['titre']) ?></h3>
            <?= paras($bloc['texte']) ?>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</section>
