module.exports = {
  cmd: ["fixchat", "fix"],
  description: "Dekode pesan dari pengirim",
  help: ["fixchat"],
  execute: async (m, { sock }) => {
    if (!m.isGroup) return await m.reply("Fitur ini hanya bisa digunakan di grup.");

    try {
      const groupMetadata = await sock.groupMetadata(m.chat);
      const participants = groupMetadata.participants;

      const fixJid = participants.map(p => sock.decodeJid(p.id));

      await m.reply(`Berhasil memperbaiki id ${fixJid.length} anggota grup.`);
    } catch (e) {
      await m.reply("Terjadi kesalahan saat mengambil data grup.");
      console.error(e);
    }
  },
};
