<?php
/** Section Programme : fil chronologique typographique. */
defined('CJ') || exit;
$p = content('programme');
?>
<section id="programme" class="section" aria-labelledby="programme-titre">
  <div class="wrap">
    <header class="section__head reveal">
      <h2 class="section__title" id="programme-titre"><?= t($p['titre']) ?></h2>
      <?php if (filled($p['intro'] ?? '')): ?><p class="section__intro"><?= t($p['intro']) ?></p><?php endif; ?>
    </header>

    <ol class="timeline">
      <?php foreach ($p['jours'] as $i => $jour): ?>
      <li class="day reveal" id="jour-<?= $i + 1 ?>">
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
              <?php if (filled($m['heure'] ?? '')): ?><p class="moment__when"><?= t($m['heure']) ?></p><?php endif; ?>
              <?php if (filled($m['lieu'] ?? '')): ?><p class="moment__where"><?= t($m['lieu']) ?></p><?php endif; ?>
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
