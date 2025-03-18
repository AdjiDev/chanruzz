let fetch = require("node-fetch");
require("../../../config/init");

module.exports = {
  cmd: ["bratv2"],
  description: "Buat stiker brat beranimasi",
  help: ["bratv2 [teks]"],
  execute: async (m, { sock, args, pakaiLimit }) => {
    try {
      const teksnya = args.join(" ");
    
      let imageUrl = `https://fastrestapis.fasturl.cloud/maker/brat/animated?text=${encodeURIComponent(teksnya)}&mode=animated`;
      
      let response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      let buffer = await response.buffer();

      await sock.sendVideoAsSticker(m.chat, buffer, m, {
        packname: global.packname,
        author: global.author
      });
      
      await pakaiLimit(1);
    } catch (error) {
      console.error("Error in bratv2 command:", error);
      await sock.sendMessage(m.chat, { text: `Terjadi kesalahan: ${error.message}` });
    }
  }
};
