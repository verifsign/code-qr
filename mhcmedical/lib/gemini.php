<?php
/**
 * Appel API Google Gemini (gratuit via Google AI Studio).
 */

function mhc_gemini_system_prompt(): string
{
    return <<<'PROMPT'
Tu es l'assistant du site MHC Medical Health and Care, magasin de matériel médical à Marseille.

RÈGLES STRICTES :
- Tu ne donnes JAMAIS de conseil médical, diagnostic, posologie ni avis sur un traitement.
- Tu ne demandes JAMAIS de données de santé personnelles (pathologie, ordonnance détaillée, nom de patient).
- En cas d'urgence : orienter vers le 15 (SAMU).
- Pour toute question précise sur un dossier, un devis ou un équipement adapté : inviter à appeler le 07 77 77 89 47 ou à venir au magasin.

INFORMATIONS FACTUELLES (à utiliser telles quelles) :
- Nom : MHC Medical Health and Care — SAS MEDICAL HEALTH AND CARE
- Adresse : 185 avenue de Saint Louis, 13015 Marseille
- Téléphone : 07 77 77 89 47
- Email : contact@mhcmedical.fr
- Horaires : lundi au vendredi, 9h–12h30 et 14h30–18h
- Activité : matériel médical pris en charge (Titres I et IV CPAM), tiers payant intégral CPAM et mutuelle — le patient n'avance en principe rien
- Parcours : ordonnance du médecin → visite au magasin avec carte Vitale → équipement et explications → facturation directe CPAM/mutuelle
- Équipements : mobilité, chambre/lit médicalisé, salle de bain, vie quotidienne, diagnostic
- Parapharmacie et orthopédie : disponibles en magasin en vente libre (hors prise en charge CPAM)
- Professionnels de santé : partenaire pour accompagner les patients (prescription à installation)

STYLE : réponses courtes (2 à 5 phrases), chaleureuses, en français, vocabulaire simple. Proposer le téléphone quand c'est plus sûr.
PROMPT;
}

/**
 * @param array{api_key:string,model?:string} $config
 * @param array<int,array{role:string,content:string}> $messages
 * @return array{ok:bool,text?:string,error?:string}
 */
function mhc_gemini_chat(array $config, array $messages): array
{
    $apiKey = trim($config['api_key'] ?? '');
    if ($apiKey === '' || $apiKey === 'VOTRE_CLE_API_ICI') {
        return ['ok' => false, 'error' => 'not_configured'];
    }

    $model = $config['model'] ?? 'gemini-2.0-flash';
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/'
        . rawurlencode($model)
        . ':generateContent?key=' . rawurlencode($apiKey);

    $contents = [];
    foreach ($messages as $message) {
        $role = ($message['role'] ?? '') === 'assistant' ? 'model' : 'user';
        $text = trim((string)($message['content'] ?? ''));
        if ($text === '') {
            continue;
        }
        $contents[] = [
            'role' => $role,
            'parts' => [['text' => $text]],
        ];
    }

    if (!$contents) {
        return ['ok' => false, 'error' => 'empty_messages'];
    }

    $payload = [
        'system_instruction' => [
            'parts' => [['text' => mhc_gemini_system_prompt()]],
        ],
        'contents' => $contents,
        'generationConfig' => [
            'temperature' => 0.35,
            'maxOutputTokens' => 600,
        ],
    ];

    if (!function_exists('curl_init')) {
        return ['ok' => false, 'error' => 'curl_missing'];
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_CONNECTTIMEOUT => 10,
    ]);

    $raw = curl_exec($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($raw === false) {
        return ['ok' => false, 'error' => 'network', 'detail' => $curlError];
    }

    $data = json_decode($raw, true);
    if ($httpCode < 200 || $httpCode >= 300) {
        $apiMessage = $data['error']['message'] ?? ('HTTP ' . $httpCode);
        return ['ok' => false, 'error' => 'api_error', 'detail' => $apiMessage];
    }

    $text = '';
    $parts = $data['candidates'][0]['content']['parts'] ?? [];
    foreach ($parts as $part) {
        if (!empty($part['text'])) {
            $text .= $part['text'];
        }
    }
    $text = trim($text);

    if ($text === '') {
        return ['ok' => false, 'error' => 'empty_reply'];
    }

    return ['ok' => true, 'text' => $text];
}

/**
 * Limite simple par IP (fichier temporaire).
 */
function mhc_chat_rate_limit(string $ip, int $maxPerHour = 30, int $minIntervalSec = 2): ?string
{
    $safeIp = preg_replace('/[^a-zA-Z0-9:.]/', '', $ip) ?: 'unknown';
    $file = sys_get_temp_dir() . '/mhc_chat_rate_' . md5($safeIp);
    $now = time();
    $state = ['count' => 0, 'window' => $now, 'last' => 0];

    if (is_readable($file)) {
        $decoded = json_decode((string)file_get_contents($file), true);
        if (is_array($decoded)) {
            $state = array_merge($state, $decoded);
        }
    }

    if ($now - (int)$state['window'] > 3600) {
        $state = ['count' => 0, 'window' => $now, 'last' => 0];
    }

    if ($state['last'] && ($now - (int)$state['last']) < $minIntervalSec) {
        return 'too_fast';
    }

    if ((int)$state['count'] >= $maxPerHour) {
        return 'hourly_limit';
    }

    $state['count'] = (int)$state['count'] + 1;
    $state['last'] = $now;
    file_put_contents($file, json_encode($state), LOCK_EX);

    return null;
}
