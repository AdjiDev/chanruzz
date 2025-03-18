let fetch = require("node-fetch");
const {
  generateWAMessageFromContent,
  generateWAMessageContent,
} = require("../../../baileys");

async function image(url, sock) {
  const { imageMessage } = await generateWAMessageContent(
    {
      image: { url },
    },
    { upload: sock.waUploadToServer }
  );
  return imageMessage;
}

let pin = async (m, { sock, text }) => {
  if (!text) return m.reply("Silakan masukkan kata kunci pencarian.");

  let api = `https://fastrestapis.fasturl.cloud/search/pinterest?name=${encodeURIComponent(text)}`;
  let res = await fetch(api);
  let json = await res.json();

  if (!json.result || json.result.length === 0) {
    return m.reply("Tidak ada gambar ditemukan.");
  }

  let cards = [];
  let limit = Math.min(json.result.length, 10); 

  for (let i = 0; i < limit; i++) {
    let img = json.result[i].directLink;
    let link = json.result[i].link;

    cards.push({
      header: {
        imageMessage: await image(img, sock),
        hasMediaAttachment: true,
      },
      body: {
        text: `Gambar ${i + 1}`,
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "Lihat Gambar",
              url: link,
              merchant_url: "https://www.pinterest.com/",
            }),
          },
        ],
      },
    });
  }

  let msg = generateWAMessageFromContent(
    m.key.remoteJid,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: `🔎 Hasil pencarian untuk: *${text}*`,
            },
            carouselMessage: {
              cards,
              messageVersion: 1,
            },
          },
        },
      },
    },
    { quoted: m}
  );

  sock.relayMessage(m.key.remoteJid, msg.message, { messageId: msg.key.id });
};

pin.cmd = ["pin", "pinterest"];
pin.help = ["pin [query]", "pinterest [query]"];
pin.description = "Cari gambar dari Pinterest";
pin.execute = pin;

module.exports = pin;
