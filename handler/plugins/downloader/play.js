let fetch = require("node-fetch");
let { search } = require("yt-search");

module.exports = {
  cmd: ["play"],
  description: "Memutar musik dari YouTube dalam format audio",
  help: ["play [judul]"],
  execute: async (m, { sock, text }) => {
    if (!text) {
      return sock.sendMessage(m.chat, { text: "❌ Masukkan judul lagu! Contoh: *play Never Gonna Give You Up*" }, { quoted: m });
    }

    let results = await search(text);
    if (!results.videos.length) {
      return sock.sendMessage(m.chat, { text: "🚫 Lagu tidak ditemukan!" }, { quoted: m });
    }

    let video = results.videos[0]; 
    let downloadYtmp3 = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(video.url)}&quality=128kbps`;

    try {
      let res = await fetch(downloadYtmp3);
      let a = await res.json();

      if (!a.result || !a.result.media) {
        return sock.sendMessage(m.chat, { text: "🚫 Gagal mengunduh lagu!" }, { quoted: m });
      }

      await sock.sendMessage(m.chat, {
        text: `🎵 *Musik Ditemukan!*\n\n📌 *Judul:* ${video.title}\n🕒 *Durasi:* ${video.timestamp}\n🔗 *Link:* ${video.url}`,
      }, { quoted: m });

      await sock.sendMessage(m.chat, {
        audio: { url: a.result.media },
        mimetype: "audio/mp4",
      }, { quoted: m });

    } catch (err) {
      console.error(err);
      sock.sendMessage(m.chat, { text: "❌ Terjadi kesalahan saat mengunduh lagu!" }, { quoted: m });
    }
  },
};
