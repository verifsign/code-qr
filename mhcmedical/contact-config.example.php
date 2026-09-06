<?php
/**
 * Configuration SMTP — formulaire de contact
 *
 * 1. Créez l'adresse contact@mhcmedical.fr dans l'espace client OVH
 * 2. Copiez ce fichier en contact-config.php (même dossier)
 * 3. Renseignez le mot de passe SMTP
 * 4. Configurez SPF et DKIM dans la zone DNS OVH (voir DEPLOIEMENT-OVH.md)
 *
 * contact-config.php n'est pas versionné et est bloqué par .htaccess.
 */
return [
    'smtp_host' => 'ssl0.ovh.net',
    'smtp_port' => 465,
    'smtp_secure' => 'ssl', // ssl (port 465) ou tls (port 587)
    'smtp_user' => 'contact@mhcmedical.fr',
    'smtp_pass' => 'VOTRE_MOT_DE_PASSE_ICI',
    'mail_from' => 'contact@mhcmedical.fr',
    'mail_from_name' => 'MHC Medical Health and Care',
    'mail_to' => 'contact@mhcmedical.fr',
];
