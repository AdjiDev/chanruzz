const { tambahLimit } = require("../../../lib/limits");

module.exports = {
  cmd: ["addlimit"],
  description: "Tambah limit user",
  help: ["addlimit [jumlah] [user]"],
  execute: async (m, { sock, args, mess, isOwner }) => {
    if (!isOwner) return m.reply(mess.owner);

    if (args.length < 1) return m.reply("Usage: addlimit [jumlah] [user]");
    let jumlah = parseInt(args[0]);
    if (isNaN(jumlah)) return m.reply("Jumlah limit tidak valid.");

    let user = m.mentionedJid[0] || m.sender;

    await tambahLimit({ sender: user }, jumlah); 
    await sock.sendMessage(m.chat, {
        text: `Berhasil menambah ${jumlah} limit untuk *@${user.split('@')[0]}*`,
        mentions: [user]
    }, { quoted: m });
  },
};
