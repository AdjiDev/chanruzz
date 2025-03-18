let fetch = require("node-fetch");
let { uploadFileUgu } = require("../../../lib/func");

let superscaleAi = async (m, { sock, pakaiLimit, quoted }) => {
  if (!quoted) return m.reply("Silakan reply gambar yang ingin di-HD-kan.");

  try {
    let media = await sock.downloadAndSaveMediaMessage(quoted);
    let mediaUrl = await uploadFileUgu(media);
    
    if (!mediaUrl || !mediaUrl.url) return m.reply("Gagal mengupload gambar.");

    let apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/superscale?imageUrl=${encodeURIComponent(
      mediaUrl.url
    )}&resize=4&anime=false`;

    let res = await fetch(apiUrl);
    let result = await res.json(); 

    if (!result || result.status !== 200 || !result.result) {
      return m.reply("Terjadi kesalahan saat memproses gambar.");
    }

    await sock.sendMessage(
      m.chat,
      {
        image: { url: result.result },
        caption: "Gambar telah di-HD-kan ✅",
      },
      { quoted: m }
    );

    if (pakaiLimit) await pakaiLimit(2);
  } catch (error) {
    console.error(error);
    return m.reply("Terjadi kesalahan saat memproses gambar.");
  }
};

superscaleAi.cmd = ["hd", "remini"];
superscaleAi.help = ["hd", "remini"];
superscaleAi.description = "Upscale image";
superscaleAi.execute = superscaleAi;

module.exports = superscaleAi;