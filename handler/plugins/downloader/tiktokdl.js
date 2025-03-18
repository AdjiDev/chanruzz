const { ttdl } = require("ruhend-scraper")

module.exports = {
  cmd: ["tt", "tiktok"],
  description: "Downloder video tiktok",
  help: ["tt [url]", "tiktok [url]"],
  limit: 2,
  execute: async (m, { sock, args }) => {
    if (!args[0]) {
      await sock.sendMessage(m.chat, {
        react: { text: "❌", key: m.key },
      });
      return;
    }
    let tturl  = args[0]
    await sock.sendMessage(m.chat, {
        react: { text: "🕛", key: m.key },
      });
    try {
        const ress = await ttdl(tturl)
        await sock.sendMessage(
            m.chat,
            {
              video: { url: ress.video },
              caption: "Here is your video!"
            },
            { quoted: m }
          );
          await sock.sendMessage(m.chat, {
            react: { text: "", key: m.key },
          });
    } catch (e) {
        await sock.sendMessage(m.chat, {
            react: { text: "❌", key: m.key }
        })
    }
  },
};
