<?php
/** Section Programme : fil chronologique typographique. */
defined('CJ') || exit;
$p = content('programme');
?>
<section id="programme" class="section" aria-labelledby="programme-titre">
  <div class="wrap">
    <header class="section__head reveal">
      <p class="eyebrow"><?= t($p['surtitre']) ?></p>
      <h2 class="section__title" id="programme-titre"><?= t($p['titre']) ?></h2>
      <?php if (filled($p['intro'] ?? '')): ?><p class="section__intro"><?= t($p['intro']) ?></p><?php endif; ?>
    </header>

    <ol class="timeline">
      <?php foreach ($p['jours'] as $jour): ?>
      <li class="day reveal">
        <h3 class="day__head">
          <span class="day__name"><?= t($jour['jour']) ?></span>
          <span class="day__date"><?= t($jour['date']) ?></span>
          <?php if (filled($jour['theme'] ?? '')): ?><span class="day__theme"><?= t($jour['theme']) ?></span><?php endif; ?>
        </h3>
        <div class="day__body">
          <?php if (filled($jour['note'] ?? '')): ?><p class="day__note"><?= t($jour['note']) ?></p><?php endif; ?>
          <ul class="moments">
            <?php foreach ($jour['moments'] as $m): ?>
            <li class="moment">
              <h4 class="moment__title"><?= t($m['titre']) ?></h4>
              <?php if (filled($m['heure'] ?? '') || filled($m['lieu'] ?? '')): ?>
              <p class="moment__meta">
                <?php if (filled($m['heure'] ?? '')): ?><span><?= t($m['heure']) ?></span><?php endif; ?>
                <?php if (filled($m['lieu'] ?? '')): ?><span><?= t($m['lieu']) ?></span><?php endif; ?>
              </p>
              <?php endif; ?>
              <?php if (filled($m['ambiance'] ?? '')): ?><p class="moment__mood"><?= t($m['ambiance']) ?></p><?php endif; ?>
            </li>
            <?php endforeach; ?>
          </ul>
        </div>
      </li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>
