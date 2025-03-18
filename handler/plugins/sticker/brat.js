let fetch = require("node-fetch");
let Jimp = require("jimp"); // Tambahkan Jimp
require("../../../config/init");

module.exports = {
  cmd: ["brat"],
  description: "Buat stiker brat",
  help: ["brat [teks]"],
  execute: async (m, { sock, text, pakaiLimit }) => {
    
    let imageUrl = `https://fastrestapis.fasturl.cloud/maker/brat/simple?text=${encodeURIComponent(text)}&theme=white`;
    
    try {
      let response = await fetch(imageUrl);
      let buffer = await response.buffer();
      
      let image = await Jimp.read(buffer);
      image.brightness(0.2); 
      image.contrast(0.2);  
      
      let editedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
      await sock.sendMessage(m.chat, {
        react: {
          text: "✨",
          key: m.key
        }
      })
      await sock.sendImageAsSticker(m.chat, editedBuffer, m, {
        packname: global.packname,
        author: global.author
      });
      await sock.sendMessage(m.chat, {
        react: {
          text: "",
          key: m.key
        }
      })
      await pakaiLimit(1);
    } catch (error) {
      console.error("❌ Error:", error);
      await sock.sendMessage(m.chat, {
        text: "❌ Gagal membuat stiker. Coba lagi nanti!",
      }, { quoted: m });
    }
  }
};
