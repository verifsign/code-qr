<?php
/**
 * Traitement formulaire de contact — MHC Medical Health and Care
 * Envoi via SMTP authentifié (contact-config.php) ou mail() en secours.
 */
header('Content-Type: text/html; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

function mhc_fake_success(): void
{
    header('Location: contact-merci.html');
    exit;
}

// Honeypot anti-spam (champ caché — doit rester vide)
if (!empty($_POST['website'])) {
    mhc_fake_success();
}

// Timestamp anti-bot : formulaire soumis trop vite ou expiré
$ts = (int)($_POST['_ts'] ?? 0);
$nowMs = (int)round(microtime(true) * 1000);
$elapsed = $nowMs - $ts;
if ($ts <= 0 || $elapsed < 3000 || $elapsed > 3600000) {
    mhc_fake_success();
}

$name    = trim(strip_tags($_POST['name'] ?? ''));
$email   = trim(strip_tags($_POST['email'] ?? ''));
$type    = trim(strip_tags($_POST['type'] ?? 'patient'));
$message = trim(strip_tags($_POST['message'] ?? ''));

$errors = [];
if ($name === '' || mb_strlen($name) > 120) {
    $errors[] = 'name';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'email';
}
if ($message === '' || mb_strlen($message) > 5000) {
    $errors[] = 'message';
}
$allowed_types = ['patient', 'prescripteur', 'autre'];
if (!in_array($type, $allowed_types, true)) {
    $type = 'patient';
}

if ($errors) {
    header('Location: contact.html?erreur=1');
    exit;
}

$configFile = __DIR__ . '/contact-config.php';
$config = is_readable($configFile) ? require $configFile : [];

$to = $config['mail_to'] ?? 'contact@mhcmedical.fr';
$type_labels = [
    'patient' => 'Patient ou aidant',
    'prescripteur' => 'Professionnel de santé',
    'autre' => 'Autre',
];
$subject = ($type === 'prescripteur')
    ? 'Demande prescripteur — MHC'
    : 'Contact depuis le site MHC';

$body = "Nom : $name\n";
$body .= "Email : $email\n";
$body .= "Profil : " . ($type_labels[$type] ?? $type) . "\n\n";
$body .= "Message :\n$message\n";

$sent = false;

if (!empty($config['smtp_pass']) && ($config['smtp_pass'] ?? '') !== 'VOTRE_MOT_DE_PASSE_ICI') {
    require_once __DIR__ . '/lib/smtp.php';
    $sent = mhc_smtp_send($config, $to, $subject, $body, $email);
}

if (!$sent) {
    $from = $config['mail_from'] ?? 'noreply@mhcmedical.fr';
    $headers = [
        'From: MHC Site <' . $from . '>',
        'Reply-To: ' . $email,
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion(),
    ];
    $sent = @mail(
        $to,
        '=?UTF-8?B?' . base64_encode($subject) . '?=',
        $body,
        implode("\r\n", $headers)
    );
}

if ($sent) {
    header('Location: contact-merci.html');
} else {
    header('Location: contact.html?erreur=envoi');
}
exit;
