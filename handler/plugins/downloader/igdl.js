const { igdl } = require("ruhend-scraper");

module.exports = {
  cmd: ["igdl", "ig"],
  description: "Instagram downloader (Reels, Post, IGTV)",
  help: ["ig [url]", "igdl [url]"],
  execute: async (m, { sock, args, pakaiLimit }) => {
    if (!args[0]) {
      await sock.sendMessage(m.chat, {
        react: { text: "❌", key: m.key },
      });
      return;
    }

    const igUrl = args[0];

    if (!/^https?:\/\/(www\.)?instagram\.com\/(reel|p|tv)\//.test(igUrl)) {
      return await sock.sendMessage(m.chat, {
        text: "URL Instagram tidak valid. Pastikan URL dimulai dengan 'https://www.instagram.com/reel/' atau yang serupa.",
      }, { quoted: m });
    }

    try {
      const result = await igdl(igUrl);
      await sock.sendMessage(m.chat, {
        react: {
          text: "🕛",
          key: m.key,
        }
      })
      await sock.sendMessage(m.chat, {
        video: {
          url: result.data.url
        },
        caption: "video telah diunduh ✅"
      }, { quoted: m })
      await sock.sendMessage(m.chat, {
        react: {
          text: "",
          key: m.key,
        }
      })
    } catch (e) {
      await sock.sendMessage(m.chat, {
        text: "❌ Gagal mengambil media Instagram. Silakan periksa URL dan coba lagi.",
      }, { quoted: m });
    }
  },
};
