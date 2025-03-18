let fetch = require("node-fetch");
require("../../../config/init")

module.exports = {
  cmd: ["bratanim", "bratanime"],
  description: "Buat stiker brat",
  help: ["bratanim [teks]", "bratanime [teks]"],
  execute: async (m, { sock, text, pakaiLimit }) => {
    
    let imageUrl = `https://fastrestapis.fasturl.cloud/maker/animbrat?text=${encodeURIComponent(text)}&position=center&mode=image`;
    
    let response = await fetch(imageUrl);
    let buffer = await response.buffer();
    
    await sock.sendImageAsSticker(m.chat, buffer, m, {
      packname: global.packname,
      author: global.author
    });
    await pakaiLimit(1)
  }
};
