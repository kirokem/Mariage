<?php
/** Section Accueil. */
defined('CJ') || exit;
$a   = content('accueil');
$img = photo('accueil', '(min-width: 64em) 40vw, (min-width: 40em) 34rem, 100vw', true);
?>
<section id="accueil" class="hero<?= $img ? ' hero--photo' : '' ?>" aria-labelledby="accueil-titre">
  <div class="hero__text">
    <p class="eyebrow"><?= t($a['surtitre']) ?></p>
    <h1 class="hero__names" id="accueil-titre">
      <span class="hero__name"><?= e($site['prenom_1']) ?></span>
      <span class="amp" aria-hidden="true">&amp;</span><span class="sr-only"> et </span>
      <span class="hero__name"><?= e($site['prenom_2']) ?></span>
    </h1>
    <span class="rule rule--center" aria-hidden="true"></span>
    <p class="hero__dates"><?= e($site['dates']) ?></p>
    <p class="hero__place"><?= e($site['lieu']) ?><span><?= e($site['region']) ?></span></p>
    <a class="btn" href="#rsvp"><?= t($a['bouton']) ?></a>
  </div>
  <?php if ($img): ?>
    <figure class="hero__photo"><?= $img ?></figure>
  <?php endif; ?>
</section>
