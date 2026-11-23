<?php
/** Section Hébergement (avec photo facultative). */
defined('CJ') || exit;
$h   = content('hebergement');
$img = photo('hebergement', '(min-width: 52em) 34rem, 100vw');
?>
<section id="hebergement" class="section" aria-labelledby="hebergement-titre">
  <div class="wrap">
    <header class="section__head reveal">
      <h2 class="section__title" id="hebergement-titre"><?= t($h['titre']) ?></h2>
    </header>

    <div class="split<?= $img ? ' split--photo' : '' ?>">
      <div class="split__main reveal">
        <?= paras($h['texte'], 'lead') ?>
        <?php if (!empty($h['details'])): ?>
        <dl class="details">
          <?php foreach ($h['details'] as $d): ?>
            <div class="details__row">
              <dt><?= t($d['libelle']) ?></dt>
              <dd><?= nl2br(t($d['valeur']), false) ?></dd>
            </div>
          <?php endforeach; ?>
        </dl>
        <?php endif; ?>
      </div>
      <?php if ($img): ?>
        <figure class="split__photo reveal"><?= $img ?></figure>
      <?php endif; ?>
    </div>
  </div>
</section>
