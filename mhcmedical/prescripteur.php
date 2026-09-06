<?php
/**
 * Demande d'équipement prescripteur — MHC Medical Health and Care
 */
header('Content-Type: text/html; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: professionnels-sante.html');
    exit;
}

function mhc_prescripteur_fake_success(): void
{
    header('Location: contact-merci.html');
    exit;
}

if (!empty($_POST['website'])) {
    mhc_prescripteur_fake_success();
}

$ts = (int)($_POST['_ts'] ?? 0);
$nowMs = (int)round(microtime(true) * 1000);
$elapsed = $nowMs - $ts;
if ($ts <= 0 || $elapsed < 3000 || $elapsed > 3600000) {
    mhc_prescripteur_fake_success();
}

$prescriberName = trim(strip_tags($_POST['prescriber_name'] ?? ''));
$prescriberRole = trim(strip_tags($_POST['prescriber_role'] ?? ''));
$prescriberPhone = trim(strip_tags($_POST['prescriber_phone'] ?? ''));
$prescriberEmail = trim(strip_tags($_POST['prescriber_email'] ?? ''));
$patientName = trim(strip_tags($_POST['patient_name'] ?? ''));
$patientPhone = trim(strip_tags($_POST['patient_phone'] ?? ''));
$equipmentType = trim(strip_tags($_POST['equipment_type'] ?? ''));
$urgency = trim(strip_tags($_POST['urgency'] ?? ''));
$comment = trim(strip_tags($_POST['comment'] ?? ''));

$roleLabels = [
    'medecin' => 'Médecin',
    'infirmier' => 'Infirmier(ère)',
    'kine' => 'Kinésithérapeute',
    'cadre' => 'Cadre de santé / établissement',
    'autre' => 'Autre professionnel',
];
$equipmentLabels = [
    'mobilite' => 'Mobilité',
    'chambre' => 'Chambre / lit médicalisé',
    'salle-de-bain' => 'Salle de bain / WC',
    'vie-quotidienne' => 'Vie quotidienne',
    'diagnostic' => 'Diagnostic / surveillance',
    'autre' => 'Autre',
];
$urgencyLabels = [
    'normal' => 'Normal (sous une semaine)',
    '48h' => 'Sous 48 heures',
    'urgent' => 'Urgent (jour même si possible)',
];

$errors = [];
if ($prescriberName === '' || mb_strlen($prescriberName) > 120) {
    $errors[] = 'prescriber_name';
}
if (!isset($roleLabels[$prescriberRole])) {
    $errors[] = 'prescriber_role';
}
if ($prescriberPhone === '' || mb_strlen($prescriberPhone) > 20) {
    $errors[] = 'prescriber_phone';
}
if ($prescriberEmail !== '' && !filter_var($prescriberEmail, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'prescriber_email';
}
if ($patientName === '' || mb_strlen($patientName) > 120) {
    $errors[] = 'patient_name';
}
if ($patientPhone === '' || mb_strlen($patientPhone) > 20) {
    $errors[] = 'patient_phone';
}
if (!isset($equipmentLabels[$equipmentType])) {
    $errors[] = 'equipment_type';
}
if (!isset($urgencyLabels[$urgency])) {
    $errors[] = 'urgency';
}
if (mb_strlen($comment) > 2000) {
    $errors[] = 'comment';
}

if ($errors) {
    header('Location: professionnels-sante.html?erreur=1#prescripteur');
    exit;
}

$configFile = __DIR__ . '/contact-config.php';
$config = is_readable($configFile) ? require $configFile : [];

$to = $config['mail_to'] ?? 'contact@mhcmedical.fr';
$subject = 'Demande prescripteur — équipement patient';

$body = "=== DEMANDE PRESCRIPTEUR ===\n\n";
$body .= "Prescripteur : $prescriberName\n";
$body .= "Qualité : " . ($roleLabels[$prescriberRole] ?? $prescriberRole) . "\n";
$body .= "Tél prescripteur : $prescriberPhone\n";
if ($prescriberEmail !== '') {
    $body .= "Email prescripteur : $prescriberEmail\n";
}
$body .= "\nPatient : $patientName\n";
$body .= "Tél patient : $patientPhone\n";
$body .= "\nMatériel : " . ($equipmentLabels[$equipmentType] ?? $equipmentType) . "\n";
$body .= "Urgence : " . ($urgencyLabels[$urgency] ?? $urgency) . "\n";
if ($comment !== '') {
    $body .= "\nCommentaire :\n$comment\n";
}

$sent = false;
$replyTo = $prescriberEmail !== '' ? $prescriberEmail : null;

if (!empty($config['smtp_pass']) && ($config['smtp_pass'] ?? '') !== 'VOTRE_MOT_DE_PASSE_ICI') {
    require_once __DIR__ . '/lib/smtp.php';
    $sent = mhc_smtp_send($config, $to, $subject, $body, $replyTo);
}

if (!$sent) {
    $from = $config['mail_from'] ?? 'noreply@mhcmedical.fr';
    $headers = [
        'From: MHC Site <' . $from . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion(),
    ];
    if ($replyTo) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }
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
    header('Location: professionnels-sante.html?erreur=envoi#prescripteur');
}
exit;
