const { ytmp3 } = require("ruhend-scraper");

module.exports = {
  cmd: ["ytmp3"],
  description: "youtube music downloader",
  help: ["ytmp3 [url]"],
  limit: 2,
  execute: async (m, { sock, args }) => {
    if (!args[0]) {
      await sock.sendMessage(m.chat, { text: "Please provide a valid YouTube URL!" });
      return;
    }

    const yturl = args[0];

    try {
      const result = await ytmp3(yturl);
      
      await sock.sendMessage(m.chat, {
        react: { text: "🕛", key: m.key }
      });

      try {
        await sock.sendMessage(
          m.chat,
          {
            audio: { url: result.audio },
            mimetype: "audio/mpeg"
          },
          { quoted: m }
        );
        await sock.sendMessage(m.chat, {
          react: { text: "", key: m.key },
        });
      } catch (innerError) {
        console.error("Error sending first audio URL: ", innerError);
        try {
          await sock.sendMessage(
            m.chat,
            {
              audio: { url: result.audio_2 },
              mimetype: "audio/mpeg"
            },
            { quoted: m }
          );
          await sock.sendMessage(m.chat, {
            react: { text: "", key: m.key },
          });
        } catch (finalError) {
          console.error("Error sending second audio URL: ", finalError);
          await sock.sendMessage(m.chat, {
            react: { text: "❌", key: m.key }
          });
        }
      }

      await sock.sendMessage(m.chat, {
        react: { text: "", key: m.key }
      });
      
    } catch (e) {
      console.error("Error fetching audio: ", e);
      await sock.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
    }
  },
};
