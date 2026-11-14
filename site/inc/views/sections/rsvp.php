<?php
/**
 * Section RSVP : formulaire de réponse.
 * Fonctionne avec JavaScript (envoi sans rechargement) et sans (envoi classique).
 * $rsvp = ['state' => 'form'|'success'|'error', 'data' => [], 'errors' => [], 'message' => '']
 */
defined('CJ') || exit;
$r   = content('rsvp');
$f   = $r['formulaire'];
$v   = $rsvp['data'] ?? [];
$err = $rsvp['errors'] ?? [];
$ok  = ($rsvp['state'] ?? '') === 'success';

$val     = fn ($k) => e($v[$k] ?? '');
$checked = fn ($k, $x) => (($v[$k] ?? '') === $x) ? ' checked' : '';
// Attributs d'accessibilité et message d'erreur d'un champ
$aria = function (string $k, string $help = '') use ($err) {
    $ids = trim($help . ' err-' . $k);
    return ' aria-describedby="' . e($ids) . '"' . (isset($err[$k]) ? ' aria-invalid="true"' : '');
};
$error = fn ($k) => '<p class="field__error" id="err-' . e($k) . '"' . (isset($err[$k]) ? '' : ' hidden') . '>' . e($err[$k] ?? '') . '</p>';
$req = '<span class="req"> (' . e($f['obligatoire']) . ')</span>';

// Le texte d'introduction contient {date_limite}, remplacée par la date en gras.
$intro = implode('<strong>' . t($r['date_limite']) . '</strong>', array_map('t', explode('{date_limite}', $r['intro'])));
?>
<section id="rsvp" class="section" aria-labelledby="rsvp-titre">
  <div class="wrap wrap--narrow">
    <header class="section__head reveal">
      <p class="eyebrow"><?= t($r['surtitre']) ?></p>
      <h2 class="section__title" id="rsvp-titre"><?= t($r['titre']) ?></h2>
      <p class="section__intro"><?= $intro ?></p>
    </header>

    <div class="rsvp__status<?= $ok ? ' is-success' : (($rsvp['state'] ?? '') === 'error' ? ' is-error' : '') ?>"
         role="status" aria-live="polite" tabindex="-1" data-rsvp-status
         <?= empty($rsvp['message']) ? 'hidden' : '' ?>><?= e($rsvp['message'] ?? '') ?></div>

    <form class="form reveal" method="post" action="rsvp.php" data-rsvp-form <?= $ok ? 'hidden' : '' ?>
          data-msg-sending="<?= e($f['envoi_en_cours']) ?>">
      <input type="hidden" name="jeton" value="<?= e(csrf_token()) ?>">

      <!-- Champ piège anti-robots : invisible pour les humains, à laisser vide. -->
      <div class="hp" aria-hidden="true">
        <label for="site_web">Ne pas remplir ce champ</label>
        <input type="text" id="site_web" name="site_web" tabindex="-1" autocomplete="off">
      </div>

      <div class="field">
        <label class="label" for="noms"><?= t($f['noms']) ?><?= $req ?></label>
        <p class="field__help" id="aide-noms"><?= t($f['noms_aide']) ?></p>
        <input class="input" type="text" id="noms" name="noms" value="<?= $val('noms') ?>" required maxlength="300" autocomplete="name"<?= $aria('noms', 'aide-noms') ?>>
        <?= $error('noms') ?>
      </div>

      <div class="field">
        <label class="label" for="email"><?= t($f['email']) ?><?= $req ?></label>
        <p class="field__help" id="aide-email"><?= t($f['email_aide']) ?></p>
        <input class="input" type="email" id="email" name="email" value="<?= $val('email') ?>" required maxlength="254" autocomplete="email" inputmode="email"<?= $aria('email', 'aide-email') ?>>
        <?= $error('email') ?>
      </div>

      <fieldset class="field"<?= $aria('presence') ?>>
        <legend class="label"><?= t($f['presence']) ?><?= $req ?></legend>
        <div class="choices choices--stack">
          <label class="choice"><input type="radio" name="presence" value="oui" required data-presence<?= $checked('presence', 'oui') ?>><span><?= t($f['presence_oui']) ?></span></label>
          <label class="choice"><input type="radio" name="presence" value="non" data-presence<?= $checked('presence', 'non') ?>><span><?= t($f['presence_non']) ?></span></label>
        </div>
        <?= $error('presence') ?>
      </fieldset>

      <!-- Questions affichées uniquement si l'invité vient -->
      <div class="form__group" data-if-present>
        <div class="field">
          <label class="label" for="regime"><?= t($f['regime']) ?></label>
          <p class="field__help" id="aide-regime"><?= t($f['regime_aide']) ?></p>
          <textarea class="input" id="regime" name="regime" rows="3" maxlength="1000"<?= $aria('regime', 'aide-regime') ?>><?= $val('regime') ?></textarea>
          <?= $error('regime') ?>
        </div>

        <div class="field-row">
          <div class="field">
            <label class="label" for="arrivee"><?= t($f['arrivee']) ?><?= $req ?></label>
            <select class="input select" id="arrivee" name="arrivee"<?= $aria('arrivee') ?>>
              <option value="">Choisir…</option>
              <?php foreach ($r['dates'] as $k => $label): ?>
                <option value="<?= e($k) ?>"<?= ($v['arrivee'] ?? '') === $k ? ' selected' : '' ?>><?= e($label) ?></option>
              <?php endforeach; ?>
            </select>
            <?= $error('arrivee') ?>
          </div>
          <div class="field">
            <label class="label" for="depart"><?= t($f['depart']) ?><?= $req ?></label>
            <select class="input select" id="depart" name="depart"<?= $aria('depart') ?>>
              <option value="">Choisir…</option>
              <?php foreach ($r['dates'] as $k => $label): ?>
                <option value="<?= e($k) ?>"<?= ($v['depart'] ?? '') === $k ? ' selected' : '' ?>><?= e($label) ?></option>
              <?php endforeach; ?>
            </select>
            <?= $error('depart') ?>
          </div>
        </div>

        <fieldset class="field"<?= $aria('transport') ?>>
          <legend class="label"><?= t($f['transport']) ?><?= $req ?></legend>
          <div class="choices">
            <?php foreach ($f['transport_options'] as $k => $label): ?>
              <label class="choice choice--inline"><input type="radio" name="transport" value="<?= e($k) ?>" data-transport<?= $checked('transport', $k) ?>><span><?= t($label) ?></span></label>
            <?php endforeach; ?>
          </div>
          <?= $error('transport') ?>
          <div class="field field--sub" data-if-transport="autre">
            <label class="label" for="transport_precision"><?= t($f['transport_precision']) ?></label>
            <input class="input" type="text" id="transport_precision" name="transport_precision" value="<?= $val('transport_precision') ?>" maxlength="150">
          </div>
        </fieldset>

        <fieldset class="field"<?= $aria('covoiturage') ?>>
          <legend class="label"><?= t($f['covoiturage']) ?><?= $req ?></legend>
          <div class="choices choices--stack">
            <?php foreach ($f['covoiturage_options'] as $k => $label): ?>
              <label class="choice"><input type="radio" name="covoiturage" value="<?= e($k) ?>" data-covoit<?= $checked('covoiturage', $k) ?>><span><?= t($label) ?></span></label>
            <?php endforeach; ?>
          </div>
          <?= $error('covoiturage') ?>
          <div class="field-row field--sub" data-if-covoit="propose cherche">
            <div class="field">
              <label class="label" for="covoit_ville"><?= t($f['covoit_ville']) ?><?= $req ?></label>
              <input class="input" type="text" id="covoit_ville" name="covoit_ville" value="<?= $val('covoit_ville') ?>" maxlength="120" autocomplete="address-level2"<?= $aria('covoit_ville') ?>>
              <?= $error('covoit_ville') ?>
            </div>
            <div class="field" data-if-covoit="propose">
              <label class="label" for="covoit_places"><?= t($f['covoit_places']) ?><?= $req ?></label>
              <input class="input" type="number" id="covoit_places" name="covoit_places" value="<?= $val('covoit_places') ?>" min="1" max="8" inputmode="numeric"<?= $aria('covoit_places') ?>>
              <?= $error('covoit_places') ?>
            </div>
          </div>
        </fieldset>
      </div>

      <div class="field">
        <label class="label" for="message"><?= t($f['message']) ?></label>
        <p class="field__help" id="aide-message"><?= t($f['message_aide']) ?></p>
        <textarea class="input" id="message" name="message" rows="4" maxlength="2000"<?= $aria('message', 'aide-message') ?>><?= $val('message') ?></textarea>
        <?= $error('message') ?>
      </div>

      <button class="btn btn--full" type="submit" data-rsvp-submit><?= t($f['bouton']) ?></button>
    </form>
  </div>
</section>
