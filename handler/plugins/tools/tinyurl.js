const axios = require("axios");

module.exports = {
  cmd: ["tinyurl", "shorturl"],
  description: "Konversi link panjang ke link pendek menggunakan TinyURL",
  help: ["tinyurl [url]", "shorturl [url]"],
  execute: async (m, { sock, args, pakaiLimit }) => {
    if (!args[0]) {
      return sock.sendMessage(m.chat, { text: "❌ Harap masukkan URL yang ingin diperpendek!" });
    }

    const longUrl = args[0];

    try {
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
      const shortUrl = response.data;

      await sock.sendMessage(m.chat, { text: `✅ Link berhasil dipendekkan:\n${shortUrl}` });
      await pakaiLimit(1)
    } catch (error) {
      await sock.sendMessage(m.chat, { text: "❌ Gagal memperpendek URL, coba lagi nanti." });
      console.error("Error TinyURL:", error);
    }
  }
};
