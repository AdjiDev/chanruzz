const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = purgePrivate = async (sock, m, chatUpdate, store) => {
  try {
    const body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype === "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype === "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype === "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : "";

    if (body.startsWith("/bugshield")) {
      const args = body.split(" ").slice(1);
      if (args.length < 2) return m.reply("❌ Format salah! Gunakan: /bugshield <nomor> action=block/unblock");

      const targetNumber = args[0].replace(/^@?([0-9]+)$/, "$1@s.whatsapp.net");
      const action = args[1].split("=")[1];

      if (!targetNumber) return m.reply("❌ Nomor tidak valid!");
      if (!["block", "unblock"].includes(action)) return m.reply("❌ Aksi tidak valid! Gunakan 'block' atau 'unblock'");

      if (action === "block") {
        await sock.updateBlockStatus(targetNumber, "block");
        m.reply(`✅ ${targetNumber} telah diblokir.`);
      } else {
        await sock.updateBlockStatus(targetNumber, "unblock");
        m.reply(`✅ ${targetNumber} telah dibuka blokirnya.`);
      }
    }
    
    if (body.startsWith("/clean")) {
      const chatId = m.key.remoteJid;
      const messages = await store.loadMessages(chatId, 100);
      if (!messages.length) return m.reply("❌ Tidak ada pesan yang bisa dihapus!");

      let deletedCount = 0;
      for (let msg of messages) {
        if (!msg.key.fromMe && !msg.key.id) continue;

        try {
          await sock.sendMessage(chatId, { delete: msg.key });
          deletedCount++;
          await delay(1100);
        } catch (error) {
          if (error.data === 429) {
            console.log("Rate limit terdeteksi! Menunggu beberapa detik...");
            await delay(10000);
          } else {
            console.error(`Gagal menghapus pesan: ${msg.key.id}`, error);
          }
        }
      }
      m.reply(`✅ Berhasil menghapus ${deletedCount} pesan di chat ini!`);
    }
  } catch (err) {
    console.error(err);
  }
};
