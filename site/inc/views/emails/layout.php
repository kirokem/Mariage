<?php
/**
 * Gabarit HTML des e-mails RSVP. Variables : $title, $intro, $rows, $outro.
 * Styles en ligne et mise en page en tableau : c'est ce que les
 * messageries (Gmail, Outlook…) affichent le mieux.
 */
defined('CJ') || exit;
$site = content('site');
$fmt = fn ($s) => nl2br(e($s), false);
?>
<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title><?= e($title) ?></title></head>
<body style="margin:0;padding:0;background:#F2ECE3;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2ECE3;">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;">
    <tr><td style="padding:36px 32px 8px;text-align:center;font-family:Arial,Helvetica,sans-serif;">
      <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#626C4A;"><?= e($site['dates']) ?></div>
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:34px;color:#2E3329;margin-top:8px;"><?= e($site['maries']) ?></div>
      <div style="width:48px;height:1px;background:#B1B8A8;margin:20px auto 0;line-height:1px;font-size:1px;">&nbsp;</div>
    </td></tr>
    <tr><td style="padding:20px 32px 8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#2E3329;">
      <?php foreach (preg_split('/\R\s*\R/u', trim($intro)) as $p): ?>
        <p style="margin:0 0 14px;"><?= $fmt($p) ?></p>
      <?php endforeach; ?>
    </td></tr>
    <tr><td style="padding:8px 32px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#2E3329;">
        <?php foreach ($rows as [$label, $value]): ?>
        <tr>
          <td style="padding:10px 0;border-top:1px solid #E4DACB;">
            <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#626C4A;"><?= e($label) ?></div>
            <div style="margin-top:2px;"><?= $fmt($value) ?></div>
          </td>
        </tr>
        <?php endforeach; ?>
      </table>
    </td></tr>
    <?php if ($outro !== ''): ?>
    <tr><td style="padding:16px 32px 8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#2E3329;">
      <p style="margin:0;"><?= $fmt($outro) ?></p>
    </td></tr>
    <?php endif; ?>
    <tr><td style="padding:24px 32px 32px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#626C4A;">
      <?= e($site['lieu']) ?> · <?= e($site['region']) ?>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>
