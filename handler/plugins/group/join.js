module.exports = {
    cmd: ["join"],
    description: "Join a WhatsApp group using an invite link",
    help: ["join [group_link]"],
    execute: async (m, { sock, args, isOwner, mess }) => {
      if (!isOwner) return m.reply(mess.owner);
      if (!args.length) {
        return m.reply("Usage: join [WhatsApp group link]");
      }
  
      const link = args[0];
      
      if (!/^https:\/\/chat\.whatsapp\.com\/[\w\d]+$/.test(link)) {
        return m.reply("Invalid WhatsApp group link!");
      }
  
      const inviteCode = link.split("/").pop();
  
      try {
        const groupId = await sock.groupAcceptInvite(inviteCode);
        m.reply(`Successfully joined the group: ${groupId}`);
      } catch (error) {
        console.error("Error joining group:", error);
        m.reply("Failed to join the group. Ensure the link is valid and the bot is not blocked.");
      }
    },
  };
  