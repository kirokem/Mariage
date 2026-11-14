<?php
/** Section Hébergement. */
defined('CJ') || exit;
$h = content('hebergement');
?>
<section id="hebergement" class="section" aria-labelledby="hebergement-titre">
  <div class="wrap">
    <header class="section__head reveal">
      <p class="eyebrow"><?= t($h['surtitre']) ?></p>
      <h2 class="section__title" id="hebergement-titre"><?= t($h['titre']) ?></h2>
    </header>

    <div class="split">
      <div class="split__main reveal">
        <?= paras($h['texte'], 'lead') ?>
      </div>
      <?php if (!empty($h['details'])): ?>
      <dl class="details reveal">
        <?php foreach ($h['details'] as $d): ?>
          <div class="details__row">
            <dt><?= t($d['libelle']) ?></dt>
            <dd><?= nl2br(t($d['valeur']), false) ?></dd>
          </div>
        <?php endforeach; ?>
      </dl>
      <?php endif; ?>
    </div>
  </div>
</section>
