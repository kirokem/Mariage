<?php
/** Section Infos pratiques / FAQ, en accordéons (<details> natifs, accessibles au clavier). */
defined('CJ') || exit;
$f  = content('infos');
$dc = $f['dress_code'];
?>
<section id="infos" class="section section--cream" aria-labelledby="infos-titre">
  <div class="wrap wrap--narrow">
    <header class="section__head reveal">
      <p class="eyebrow"><?= t($f['surtitre']) ?></p>
      <h2 class="section__title" id="infos-titre"><?= t($f['titre']) ?></h2>
    </header>

    <div class="faq reveal">
      <details class="faq__item">
        <summary class="faq__q"><h3><?= t($dc['question']) ?></h3><span class="faq__icon" aria-hidden="true"></span></summary>
        <div class="faq__a">
          <?= paras($dc['reponse']) ?>
          <?php if (!empty($dc['palette'])): ?>
          <ul class="palette" aria-label="Palette du mariage">
            <?php foreach ($dc['palette'] as $i => $c): ?>
              <li class="swatch swatch--<?= (int) $i ?>"><span class="swatch__dot" aria-hidden="true"></span><?= t($c['nom']) ?></li>
            <?php endforeach; ?>
          </ul>
          <?php endif; ?>
        </div>
      </details>

      <?php foreach ($f['questions'] as $q): ?>
      <details class="faq__item">
        <summary class="faq__q"><h3><?= t($q['question']) ?></h3><span class="faq__icon" aria-hidden="true"></span></summary>
        <div class="faq__a"><?= paras($q['reponse']) ?></div>
      </details>
      <?php endforeach; ?>
    </div>
  </div>
</section>
