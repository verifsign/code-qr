<?php
/**
 * Proxy chat IA — MHC Medical Health and Care
 * La clé API reste côté serveur (chat-config.php).
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Robots-Tag: noindex, nofollow');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$configFile = dirname(__DIR__) . '/chat-config.php';
$config = is_readable($configFile) ? require $configFile : [];

if (empty($config['enabled'])) {
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'error' => 'disabled',
        'message' => 'L\'assistant n\'est pas activé. Appelez le 07 77 77 89 47.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once dirname(__DIR__) . '/lib/gemini.php';

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateError = mhc_chat_rate_limit($ip);
if ($rateError !== null) {
    http_response_code(429);
    $messages = [
        'too_fast' => 'Merci d\'attendre quelques secondes entre deux messages.',
        'hourly_limit' => 'Limite atteinte pour cette heure. Appelez le 07 77 77 89 47.',
    ];
    echo json_encode([
        'ok' => false,
        'error' => $rateError,
        'message' => $messages[$rateError] ?? 'Trop de requêtes.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw ?: '', true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_json']);
    exit;
}

$userMessage = trim(strip_tags((string)($input['message'] ?? '')));
if ($userMessage === '' || mb_strlen($userMessage) > 500) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => 'invalid_message',
        'message' => 'Votre message doit contenir entre 1 et 500 caractères.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$history = $input['history'] ?? [];
if (!is_array($history)) {
    $history = [];
}

$maxHistory = (int)($config['max_history'] ?? 8);
$messages = [];

foreach ($history as $item) {
    if (!is_array($item)) {
        continue;
    }
    $role = ($item['role'] ?? '') === 'assistant' ? 'assistant' : 'user';
    $content = trim(strip_tags((string)($item['content'] ?? '')));
    if ($content === '' || mb_strlen($content) > 800) {
        continue;
    }
    $messages[] = ['role' => $role, 'content' => $content];
    if (count($messages) >= $maxHistory) {
        break;
    }
}

$messages[] = ['role' => 'user', 'content' => $userMessage];

$result = mhc_gemini_chat($config, $messages);

if (!$result['ok']) {
    $status = 503;
    $publicMessage = 'L\'assistant est momentanément indisponible. Appelez le 07 77 77 89 47.';

    if (($result['error'] ?? '') === 'not_configured') {
        $publicMessage = 'Assistant non configuré sur le serveur. Appelez le 07 77 77 89 47.';
    }

    http_response_code($status);
    echo json_encode([
        'ok' => false,
        'error' => $result['error'] ?? 'unknown',
        'message' => $publicMessage,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'ok' => true,
    'reply' => $result['text'],
], JSON_UNESCAPED_UNICODE);
