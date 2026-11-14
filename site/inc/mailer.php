<?php
/**
 * Envoi d'e-mails via le SMTP d'Infomaniak, avec PHPMailer
 * (inclus dans lib/PHPMailer, aucune installation nécessaire).
 */

defined('CJ') || exit;

require_once CJ_ROOT . '/lib/PHPMailer/Exception.php';
require_once CJ_ROOT . '/lib/PHPMailer/PHPMailer.php';
require_once CJ_ROOT . '/lib/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;

/**
 * Envoie un e-mail. Lève une exception en cas d'échec.
 *
 * @param string[]    $to       destinataires
 * @param string      $subject  objet
 * @param string      $html     corps HTML
 * @param string      $text     corps texte brut (alternative)
 * @param string|null $replyTo  adresse de réponse
 */
function send_mail(array $to, string $subject, string $html, string $text, ?string $replyTo = null, ?string $replyName = null): void
{
    $smtp = config('smtp', []);
    $mail = new PHPMailer(true);
    $mail->CharSet  = PHPMailer::CHARSET_UTF8;
    $mail->Encoding = PHPMailer::ENCODING_QUOTED_PRINTABLE;
    $mail->isSMTP();
    $mail->Host       = $smtp['host'] ?? 'mail.infomaniak.com';
    $mail->Port       = (int) ($smtp['port'] ?? 465);
    $mail->Timeout    = (int) ($smtp['timeout'] ?? 15);
    $mail->SMTPAuth   = ($smtp['username'] ?? '') !== '';
    $mail->Username   = $smtp['username'] ?? '';
    $mail->Password   = $smtp['password'] ?? '';
    $enc = $smtp['encryption'] ?? 'ssl';
    if ($enc === 'ssl') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } elseif ($enc === 'tls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } else {
        // Uniquement pour les tests en local (serveur SMTP de test).
        $mail->SMTPSecure  = '';
        $mail->SMTPAutoTLS = false;
    }

    $mail->setFrom((string) config('from_email'), (string) config('from_name', ''));
    foreach ($to as $address) {
        $mail->addAddress($address);
    }
    if ($replyTo) {
        $mail->addReplyTo($replyTo, (string) $replyName);
    }
    $mail->Subject = $subject;
    $mail->isHTML(true);
    $mail->Body    = $html;
    $mail->AltBody = $text;
    $mail->send();
}

/** Consigne une erreur technique (sans données personnelles) dans storage/logs. */
function log_error(string $message): void
{
    $dir = CJ_ROOT . '/storage/logs';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    @file_put_contents($dir . '/erreurs.log', '[' . date('c') . '] ' . $message . PHP_EOL, FILE_APPEND | LOCK_EX);
}
