const { uploadFileUgu } = require("../../../lib/func")

module.exports = {
    cmd: ["tourl"],
    description: "Gambar ke link",
    help: ["tourl"],
    execute: async (m, { sock, pakaiLimit, quoted, mime, qmsg }) => {
        const media = await sock.downloadAndSaveMediaMessage(qmsg)
        if (/image/.test(mime)) {
            let files = await uploadFileUgu(media)
            await m.reply(JSON.stringify(files, null, 2))
        }
    },
  };
  