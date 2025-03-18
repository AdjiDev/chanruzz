const { addPremiumUser } = require("../../../lib/premium");
const toMs = require("ms");
const fs = require("fs");

module.exports = {
  cmd: ["addprem", "addpremuser"],
  description: "Tambah user premium",
  help: ["addprem [nomor] [durasi]"],
  execute: async (m, { sock, args, mess, isOwner }) => {
    if (!isOwner) return m.reply(mess.owner)

    let premium = JSON.parse(fs.readFileSync("./src/premium.json"));
    let nomor = args[0];
    const durasi = args[1];

    if (!nomor || !durasi) {
      return m.reply("❌ Format salah! Gunakan: *addprem [nomor] [durasi]*");
    }

    if (!toMs(durasi)) {
      return m.reply(
        "Format durasi tidak valid. Gunakan format yang benar, misalnya '1d' untuk 1 hari."
      );
    }

    if (m.mentionedJid.length !== 0) {
      for (let i = 0; i < m.mentionedJid.length; i++) {
        addPremiumUser(m.mentionedJid[i], durasi, premium);
      }
      return m.reply(
        `User *${m.mentionedJid.join(', ')}* telah berhasil ditambahkan ke dalam daftar premium selama ${durasi}.`
      );
    } else {
      const userJid = nomor + "@s.whatsapp.net";
      addPremiumUser(userJid, durasi, premium);
      return m.reply(
        `User *${nomor}* telah berhasil ditambahkan ke dalam daftar premium selama ${durasi}.`
      );
    }
  },
};
