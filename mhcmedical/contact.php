<?php
/**
 * Traitement formulaire de contact — MHC Medical Health and Care
 * Hébergement OVH (PHP activé par défaut)
 */
header('Content-Type: text/html; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

// Honeypot anti-spam (champ caché — doit rester vide)
if (!empty($_POST['website'])) {
    header('Location: contact-merci.html');
    exit;
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

$to = 'contact@mhcmedical.fr';
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

$headers = [
    'From: MHC Site <noreply@mhcmedical.fr>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if ($sent) {
    header('Location: contact-merci.html');
} else {
    header('Location: contact.html?erreur=envoi');
}
exit;
