const { ytmp4 } = require("ruhend-scraper");

module.exports = {
  cmd: ["ytmp4"],
  description: "youtube video downloader",
  help: ["ytmp4 [url]"],
  limit: 2,
  execute: async (m, { sock, args }) => {
    if (!args[0]) {
      await sock.sendMessage(m.chat, { text: "Please provide a valid YouTube URL!" });
      return;
    }

    const yturl = args[0];

    try {
      const result = await ytmp4(yturl);
      
      await sock.sendMessage(m.chat, {
        react: { text: "🕛", key: m.key },
      });
      await sock.sendMessage(
        m.chat,
        {
          video: { url: result.video },
          caption: "Here is your video!"
        },
        { quoted: m }
      );
      await sock.sendMessage(m.chat, {
        react: { text: "", key: m.key },
      });
      
    } catch (e) {
      console.error("Error fetching video: ", e);
      await sock.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
    }
  },
};
