const getGroupAdmins = (participants) => {
  let admins = [];
  for (let i of participants) {
    i.admin === "superadmin" || i.admin === "admin" ? admins.push(i.id) : "";
  }
  return admins || [];
};

module.exports = {
  cmd: ["kick"],
  description: "Keluarkan salah satu anggota grup",
  help: ["kick [user]"],
  execute: async (m, { sock }) => {
    try {
      if (!m.isGroup) return m.reply("hanya bisa digunakan di group")
      const botnumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";

      const groupMetadata = await sock.groupMetadata(m.chat);
      const participants = groupMetadata.participants;

      const admins = getGroupAdmins(participants);

      if (!admins.includes(m.sender) && m.sender !== botnumber) {
        return m.reply("❌ Hanya admin yang dapat mengeluarkan anggota!");
      }

      const mentioned = m.mentionedJid[0];
      if (!mentioned) {
        await sock.groupParticipantsUpdate(m.chat, [m.quoted.sender], "remove");
        m.reply(`✅ Pengguna ${mentioned} telah dikeluarkan dari grup!`);
      }

      const userToKick = participants.find(
        (participant) => participant.id === mentioned
      );
      if (!userToKick) {
        return;
      }

      if (mentioned === botnumber) {
        return m.reply("❌ Saya tidak bisa mengeluarkan diri saya sendiri!");
      }

      await sock.groupParticipantsUpdate(m.chat, [mentioned], "remove");
      m.reply(`✅ Pengguna ${mentioned} telah dikeluarkan dari grup!`);
    } catch (err) {
      console.error("Error while kicking user:", err);
      m.reply("❌ Terjadi kesalahan saat mencoba mengeluarkan pengguna!");
    }
  },
};
