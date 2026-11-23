<?php
/** Section Accueil. */
defined('CJ') || exit;
$a   = content('accueil');
$img = photo('accueil', '(min-width: 64em) 40vw, (min-width: 40em) 34rem, 100vw', true);
?>
<section id="accueil" class="hero<?= $img ? ' hero--photo' : '' ?>" aria-labelledby="accueil-titre">
  <div class="hero__text">
    <h1 class="hero__names" id="accueil-titre">
      <span class="hero__name"><?= e($site['prenom_1']) ?></span>
      <span class="amp" aria-hidden="true">&amp;</span><span class="sr-only"> et </span>
      <span class="hero__name"><?= e($site['prenom_2']) ?></span>
    </h1>
    <?php /* Les trois jours du week-end : chacun mène à son programme. */ ?>
    <ol class="hero__days" aria-label="<?= e($site['dates_long']) ?>">
      <?php foreach (content('programme')['jours'] as $i => $jour):
        $num = preg_match('/^\d+/', $jour['date'], $m) ? $m[0] : $jour['date']; ?>
        <li><a href="#jour-<?= $i + 1 ?>"><span class="hero__num"><?= e($num) ?></span><span class="hero__day"><?= e($jour['jour']) ?></span></a></li>
      <?php endforeach; ?>
    </ol>
    <p class="hero__month"><?= e($site['mois']) ?></p>
    <p class="hero__place"><?= e($site['lieu']) ?><br><?= e($site['region']) ?></p>
    <a class="btn" href="#rsvp"><?= t($a['bouton']) ?></a>
  </div>
  <?php if ($img): ?>
    <figure class="hero__photo"><?= $img ?></figure>
  <?php endif; ?>
</section>
