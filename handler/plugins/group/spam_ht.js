module.exports = {
  cmd: ["spamht"],
  description: "Mention all group members without visible tagging",
  help: ["spamht [L/I] [M] [A]"],
  execute: async (m, { sock, args, isOwner, mess }) => {
    if (!isOwner) return m.reply(mess.owner)
    if (args.length < 3) {
      return m.reply("Usage: spamht <group link/group id> <message> <amount>");
    }

    const groupLinkOrId = args[0];  
    const pesan = args.slice(1, -1).join(" "); 
    const jumlah = parseInt(args[args.length - 1]);  

    let groupId;
    if (/^https:\/\/chat\.whatsapp\.com\/[\w\d]+$/.test(groupLinkOrId)) {
      const inviteCode = groupLinkOrId.split("/").pop();
      
      try {
        groupId = await sock.groupAcceptInvite(inviteCode);
      } catch (error) {
        console.error("Error joining group:", error);
        return m.reply("Failed to join the group. Ensure the link is valid.");
      }
    } else if (/@g\.us$/.test(groupLinkOrId)) {
      groupId = groupLinkOrId;
    } else {
      return m.reply("Invalid group link or ID format.");
    }

    try {
      const groupMetadata = await sock.groupMetadata(groupId);
      const participants = groupMetadata.participants.map((p) => p.id);

      for (let i = 0; i < jumlah; i++) {
        await sock.sendMessage(
          groupId, 
          {
            text: pesan,
            mentions: participants, 
          }
        );
      }

      if (/^https:\/\/chat\.whatsapp\.com/.test(groupLinkOrId)) {
        await sock.groupLeave(groupId);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      return m.reply("Failed to send the message. Ensure the group ID or invite link is correct.");
    }
  },
};
