const { search } = require("yt-search");

module.exports = {
  cmd: ["yts", "ytsearch"],
  description: "Cari video di YouTube",
  help: ["yts [query]", "ytsearch [query]"],
  execute: async (m, { sock, args }) => {
    if (args.length === 0) {
      return m.reply("Silakan masukkan kata kunci untuk mencari video YouTube.\n\nContoh: */yts Coldplay Viva La Vida*");
    }

    const query = args.join(" ");
    
    try {
      const results = await search(query);
      if (!results.videos.length) {
        return m.reply("Tidak ditemukan hasil untuk pencarian tersebut.");
      }

      let message = `🔍 **Hasil Pencarian untuk:** *${query}*\n\n`;
      
      results.videos.slice(0, 5).forEach((video, index) => {
        message += `🎥 *${index + 1}. ${video.title}*\n`;
        message += `⏳ Durasi: ${video.timestamp}\n`;
        message += `🔗 Link: ${video.url})\n\n`;
      });

      await sock.sendMessage(m.chat, { text: message }, { quoted: m });

    } catch (error) {
      console.error("Error fetching YouTube search results:", error);
      return m.reply("Terjadi kesalahan saat mencari video. Coba lagi nanti.");
    }
  },
};
