<?php
/**
 * Configuration assistant IA — MHC Medical Health and Care
 *
 * 1. Créez une clé API gratuite sur https://aistudio.google.com/apikey
 * 2. Copiez ce fichier en chat-config.php (même dossier)
 * 3. Collez votre clé ci-dessous
 *
 * chat-config.php n'est pas versionné et est bloqué par .htaccess.
 */
return [
    'enabled' => true,
    'api_key' => 'VOTRE_CLE_API_ICI',
    'model' => 'gemini-2.0-flash',
    'max_history' => 8,
];
