const moment = require("moment-timezone");
const { default: decor } = require("../lib/color");

function getLiveTime() {
  return moment.tz("Asia/Jakarta").format("HH:mm:ss");
}

module.exports = bot = async (sock, m, msg, chatUpdate, store) => {
  try {
    const detectMessageType = (m) => {
      const typeMap = {
        conversation: m.message.conversation,
        imageMessage: m.message.imageMessage?.caption || "Image message",
        videoMessage: m.message.videoMessage?.caption || "Video message",
        extendedTextMessage: m.message.extendedTextMessage?.text,
        buttonsResponseMessage: m.message.buttonsResponseMessage?.selectedButtonId,
        listResponseMessage: m.message.listResponseMessage?.singleSelectReply?.selectedRowId,
        templateButtonReplyMessage: m.message.templateButtonReplyMessage?.selectedId,
        contactMessage: "Contact: " + m.message.contactMessage?.displayName,
        locationMessage: "Location message",
        documentMessage: "Document: " + m.message.documentMessage?.fileName,
        stickerMessage: "Sticker message",
        audioMessage: "Audio message",
        reactionMessage: "Reaction message",
        ptvMessage: "PTV message",
        call: `${m.pushName} is Calling to bot`,
        documentWithCaptionMessage: m.message.documentWithCaptionMessage?.caption,
        viewOnceMessage: "View once message",
        viewOnceMessageV2: "View once message",
        protocolMessage: "Protocol message"
      };
      return typeMap[m.mtype] || "Unknown Message Type";
    };

    const body = detectMessageType(m);
    const from = m.key.remoteJid;
    const pushname = m.pushName || "No Name";
    const sender = m.sender;
    const isGroup = m.key.remoteJid.endsWith("@g.us");
    const groupMetadata = isGroup ? await sock.groupMetadata(m?.chat).catch(() => {}) : "";
    const bot = await sock.decodeJid(sock.user.id);
    const groupName = isGroup ? groupMetadata?.subject : "";
    const statusJid = from.includes("status@broadcast");
    const newsletterJid = from.endsWith("@newsletter");

    if (global.log) {
      console.log(
        `====================[ ${decor.underline}${getLiveTime()}${decor.reset} ]====================`
      );
      console.log(`${decor.dim}Incoming messages${decor.reset}`);
      console.log(`${decor.green}Message:${decor.reset} ${decor.bold}${body || "Unknown message"}${decor.reset}`);
      console.log(`${decor.green}RemoteJid:${decor.reset} ${decor.bold}${from}${decor.reset}`);
      console.log(`${decor.green}Sender:${decor.reset} ${decor.bold}${sender}${decor.reset}`);
      console.log(`${decor.green}IsGroupChat:${decor.reset} ${decor.bold}${isGroup}${decor.reset}`);
      console.log(
        `${decor.green}Pushname:${decor.reset} ${decor.bold}${pushname || groupName || "User"}${decor.reset}`
      );
      console.log(
        `${decor.green}Chat:${decor.reset} ${decor.bold}${groupName || "Private Chat"}${decor.reset}`
      );
    }
  } catch (err) {
    console.error(err);
  }
};
