require("../../../config/init");
const { database } = require("../../../database");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const { cekLimit } = require("../../../lib/limits");

module.exports = {
  cmd: ["help", "menu"],
  description: "Displays this text",
  help: ["help [category|all]", "menu [category|all]"],
  execute: async (m, { sock, args, prefix }) => {
    try {
      let selectedCategory = args[0]?.toLowerCase();
      const sender = `@${m.sender.split("@")[0]}`;

      let userData = await database({ name: sender });
      let totalFitur = 0;

      for (const category in global.plugins) {
        for (const pluginName in global.plugins[category]) {
          const plugin = global.plugins[category][pluginName];
          if (plugin.cmd && Array.isArray(plugin.cmd)) {
            totalFitur += plugin.cmd.length;
          }
        }
      }
      if (!userData) {
        return m.reply("Data pengguna tidak ditemukan. Harap coba lagi.");
      }

      const limit = await cekLimit(m);

      let helpMessage = "━━━━━━━━━━━━━━━━━━━━━[₪]\n";
      helpMessage += `*Bot WhatsApp ${global.botname}*\n`;
      helpMessage += `\`\`\`Halo ${m.pushName || "user"}, saya adalah bot WhatsApp simpel yang bisa membantu anda melalui WhatsApp jika perlu.\`\`\`\n\n`;
      helpMessage += `┏━━━━━━━━━━━━━━━━━[₪]\n`;
      helpMessage += `┃ [\`\`\`Informasi\`\`\`]\n`;
      helpMessage += `┃ > Limit: *${limit}*\n`;
      helpMessage += `┃ > Total Fitur: *${totalFitur}*\n`;
      helpMessage += `┃ > Developer: *t.me/adjidev*\n`;
      helpMessage += `┗━━━━━━━━━━━━━━━━━[₪]\n\n${readmore}`;

      if (selectedCategory && selectedCategory !== "all") {
        if (global.plugins[selectedCategory]) {
          helpMessage += `┏━━━━━━━━━━━━━━━━[₪]\n`;
          helpMessage += `┃ 「 ✦ ${selectedCategory.toUpperCase()} ✦ 」\n`;

          for (const pluginName in global.plugins[selectedCategory]) {
            const plugin = global.plugins[selectedCategory][pluginName];
            if (plugin.help && plugin.description) {
              helpMessage +=
                plugin.help.map((help) => `┃ ✦ *${prefix}${help}*`).join("\n") +
                "\n";
            }
          }
          helpMessage += `┗━━━━━━━━━━━━━━━━[₪]\n`;
        } else {
          helpMessage += `⚠️ Kategori *${selectedCategory}* tidak ditemukan.\nGunakan *${prefix}menu all* untuk menampilkan semua kategori.\n`;
        }
      } else {
        for (const category in global.plugins) {
          helpMessage += `┏━━━━━━━━━━━━━━━━[₪]\n`;
          helpMessage += `┃ 「 ✦ ${category.toUpperCase()} ✦ 」\n`;

          if (global.plugins[category]) {
            for (const pluginName in global.plugins[category]) {
              const plugin = global.plugins[category][pluginName];
              if (plugin.help && plugin.description) {
                helpMessage +=
                  plugin.help
                    .map((help) => `┃ ✦ *${prefix}${help}*`)
                    .join("\n") + "\n";
              }
            }
          }
          helpMessage += `┗━━━━━━━━━━━━━━━━[₪]\n\n`;
        }
      }

      const qtext = {
        key: {
          fromMe: false,
          participant: "0@s.whatsapp.net",
          ...(m.chat ? { remoteJid: "status@broadcast" } : {}),
        },
        message: {
          extendedTextMessage: {
            text: `${m.text}`,
            title: global.botname,
          },
        },
      };

      await sock.sendImgButton(m.chat, {
        image: global.thumb2,
        caption: helpMessage,
        footer: "adjidev",
        buttons: [
          { buttonId: "/ping", buttonText: { displayText: "Ping" }, type: 1 },
          { buttonId: "/think siapa anda?", buttonText: { displayText: "What?" }, type: 1 },
        ],
        mentions: [m.sender]
      }, { quoted: qtext});
      
    } catch (err) {
      console.error("Error executing help command:", err);
      await sock.sendMessage(m.chat, {
        text: "Terjadi kesalahan saat memproses perintah. Silakan coba lagi.",
      });
    }
  },
};
