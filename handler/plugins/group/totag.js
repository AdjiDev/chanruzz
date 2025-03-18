const getGroupAdmins = (participants) => {
    let admins = [];
    for (let i of participants) {
      if (i.admin === "superadmin" || i.admin === "admin") {
        admins.push(i.id);
      }
    }
    return admins; 
  };
  
  module.exports = {
    cmd: ["tagquoted", "totag"],
    description: "Notify everyone with quoted messages",
    help: ["totag"],
    limit: 1,
    async execute(m, { sock }) {
      if (!m.isGroup) return m.reply("This command can only be used in groups.");
  
      const groupMetadata = await sock.groupMetadata(m.chat);
      const participants = groupMetadata.participants;
      const groupOwner = m.isGroup ? groupMetadata?.owner : "";
      const groupAdmins = await getGroupAdmins(participants);
      const botNumber = sock.decodeJid(sock.user.id)
  
      const isSenderAdmin = groupAdmins.includes(m.sender);
      const isBotAdmin = groupAdmins.includes(botNumber);
      const isSenderGroupOwner = (groupOwner ? groupOwner : groupAdmins).includes(m.sender);
  
      if (!isSenderAdmin && !isSenderGroupOwner) {
        return m.reply("This command can only be used by admins.");
      }
  
      if (!m?.quoted) return m.reply("Please quote a message to tag all participants.");
  
      await sock.sendMessage(m.chat, {
        forward: m.quoted.fakeObj,
        mentions: participants.map((a) => a.id),
      });
    },
  };
  