<?php
/** Page d'entrée : saisie du mot de passe du faire-part. Variable : $gateError. */
defined('CJ') || exit;
$site   = content('site');
$entree = content('entree');
$pageTitle = $site['maries'];
include __DIR__ . '/head.php';
?>
<body class="gate">
<main class="gate__main">
  <div class="gate__card">
    <p class="gate__dates"><?= e($site['dates']) ?></p>
    <h1 class="gate__names">
      <span><?= e($site['prenom_1']) ?></span>
      <span class="amp" aria-hidden="true">&amp;</span><span class="sr-only"> et </span>
      <span><?= e($site['prenom_2']) ?></span>
    </h1>
    <span class="rule rule--center" aria-hidden="true"></span>
    <p class="gate__place"><?= e($site['lieu']) ?></p>

    <form class="gate__form" method="post" action="./">
      <p class="gate__intro" id="gate-intro"><?= t($entree['intro']) ?></p>
      <label class="label" for="mot_de_passe"><?= e($entree['libelle']) ?></label>
      <input class="input" type="password" id="mot_de_passe" name="mot_de_passe"
             autocomplete="current-password" required autofocus
             aria-describedby="gate-intro<?= $gateError ? ' gate-erreur' : '' ?>"
             <?= $gateError ? 'aria-invalid="true"' : '' ?>>
      <?php if ($gateError): ?>
        <p class="field__error" id="gate-erreur" role="alert"><?= e($gateError) ?></p>
      <?php endif; ?>
      <button class="btn btn--solid btn--full" type="submit"><?= e($entree['bouton']) ?></button>
    </form>
  </div>
</main>
</body>
</html>
