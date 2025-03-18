require("../../../config/init");

module.exports = {
  cmd: ["sticker", "stiker", "s"],
  description: "Gambar, gif dan video ke sticker",
  help: ["sticker", "stiker", "s"],
  execute: async (m, { sock, prefix }) => {
    const mixedMsg = m.quoted || m;
    const quoted =
      mixedMsg.mtype == "buttonsMessage"
        ? mixedMsg[Object.keys(mixedMsg)[1]]
        : mixedMsg.mtype == "templateMessage"
        ? mixedMsg.hydratedTemplate[Object.keys(mixedMsg.hydratedTemplate)[1]]
        : mixedMsg.mtype == "product"
        ? mixedMsg[Object.keys(mixedMsg)[0]]
        : m.quoted
        ? m.quoted
        : m;

    const mime = (quoted.msg || quoted).mimetype || "";

    if (!quoted) {
      return m.reply("❌ Tidak ada media yang dapat diproses.");
    }

    if (/image/.test(mime)) {
      try {
        let media = await quoted.download();
        await sock.sendImageAsSticker(m.chat, media, m, {
          packname: m.pushName,
          author: global.author,
        });
      } catch (error) {
        m.reply("❌ Gagal mengonversi gambar menjadi stiker.");
      }
    } else if (/video/.test(mime)) {
      if ((quoted.msg || quoted).seconds > 11) {
        return m.reply("❌ Video terlalu panjang. Maksimal 10 detik.");
      }

      try {
        let media = await quoted.download();
        await sock.sendVideoAsSticker(m.chat, media, m, {
          packname: m.pushName,
          author: global.author,
        });
      } catch (error) {
        m.reply("❌ Gagal mengonversi video menjadi stiker.");
      }
    } else {
      m.reply("❌ Hanya gambar atau video yang dapat diubah menjadi stiker.");
    }
  },
};
