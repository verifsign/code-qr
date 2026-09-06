<?php
/**
 * Envoi SMTP minimal (AUTH LOGIN) — OVH mutualisé, sans dépendance externe.
 */
function mhc_smtp_read($socket): string
{
    $data = '';
    while ($line = fgets($socket, 515)) {
        $data .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    return $data;
}

function mhc_smtp_write($socket, string $cmd): void
{
    fwrite($socket, $cmd . "\r\n");
}

function mhc_smtp_send(array $config, string $to, string $subject, string $body, string $replyTo): bool
{
    $host = $config['smtp_host'] ?? '';
    $port = (int)($config['smtp_port'] ?? 465);
    $secure = $config['smtp_secure'] ?? 'ssl';
    $user = $config['smtp_user'] ?? '';
    $pass = $config['smtp_pass'] ?? '';
    $from = $config['mail_from'] ?? $user;
    $fromName = $config['mail_from_name'] ?? 'MHC Site';

    if ($host === '' || $user === '' || $pass === '') {
        return false;
    }

    $remote = ($secure === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;
    $socket = @stream_socket_client($remote, $errno, $errstr, 15);
    if (!$socket) {
        return false;
    }

    stream_set_timeout($socket, 15);

    mhc_smtp_read($socket);
    mhc_smtp_write($socket, 'EHLO mhcmedical.fr');
    mhc_smtp_read($socket);

    if ($secure === 'tls') {
        mhc_smtp_write($socket, 'STARTTLS');
        mhc_smtp_read($socket);
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($socket);
            return false;
        }
        mhc_smtp_write($socket, 'EHLO mhcmedical.fr');
        mhc_smtp_read($socket);
    }

    mhc_smtp_write($socket, 'AUTH LOGIN');
    mhc_smtp_read($socket);
    mhc_smtp_write($socket, base64_encode($user));
    mhc_smtp_read($socket);
    mhc_smtp_write($socket, base64_encode($pass));
    $auth = mhc_smtp_read($socket);
    if (strpos($auth, '235') === false) {
        fclose($socket);
        return false;
    }

    mhc_smtp_write($socket, 'MAIL FROM:<' . $from . '>');
    mhc_smtp_read($socket);
    mhc_smtp_write($socket, 'RCPT TO:<' . $to . '>');
    mhc_smtp_read($socket);
    mhc_smtp_write($socket, 'DATA');
    mhc_smtp_read($socket);

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $message =
        'From: ' . $fromName . ' <' . $from . ">\r\n" .
        'To: ' . $to . "\r\n" .
        'Reply-To: ' . $replyTo . "\r\n" .
        'MIME-Version: 1.0' . "\r\n" .
        'Content-Type: text/plain; charset=UTF-8' . "\r\n" .
        'Content-Transfer-Encoding: 8bit' . "\r\n" .
        'Subject: ' . $encodedSubject . "\r\n" .
        "\r\n" .
        $body . "\r\n.";

    mhc_smtp_write($socket, $message);
    $sent = mhc_smtp_read($socket);
    mhc_smtp_write($socket, 'QUIT');
    fclose($socket);

    return strpos($sent, '250') !== false;
}
