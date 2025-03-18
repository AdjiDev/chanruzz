const fs = require("fs");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require("../lib/exif");
const axios = require("axios"); // Use axios to fetch remote media

async function getBuffer(url) {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(res.data);
}

async function ConverterSticker(sock) {
    sock.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        try {
            let buff = Buffer.isBuffer(path)
                ? path
                : /^data:.*?\/.*?;base64,/i.test(path)
                    ? Buffer.from(path.split(",")[1], "base64")
                    : /^https?:\/\//.test(path)
                        ? await getBuffer(path)
                        : fs.existsSync(path)
                            ? fs.readFileSync(path)
                            : Buffer.alloc(0);

            if (buff.length === 0) throw new Error("Invalid media input");

            let buffer = options.packname || options.author
                ? await writeExifImg(buff, options)
                : await imageToWebp(buff);

            await sock.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });

            if (fs.existsSync(buffer)) fs.unlinkSync(buffer); // Clean up temp files
            return buffer;
        } catch (error) {
            console.error("sendImageAsSticker Error:", error);
        }
    };

    sock.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        try {
            let buff = Buffer.isBuffer(path)
                ? path
                : /^data:.*?\/.*?;base64,/i.test(path)
                    ? Buffer.from(path.split(",")[1], "base64")
                    : /^https?:\/\//.test(path)
                        ? await getBuffer(path)
                        : fs.existsSync(path)
                            ? fs.readFileSync(path)
                            : Buffer.alloc(0);

            if (buff.length === 0) throw new Error("Invalid media input");

            let buffer = options.packname || options.author
                ? await writeExifVid(buff, options)
                : await videoToWebp(buff);

            await sock.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });

            if (fs.existsSync(buffer)) fs.unlinkSync(buffer);
            return buffer;
        } catch (error) {
            console.error("sendVideoAsSticker Error:", error);
        }
    };
}

module.exports = {
    ConverterSticker,
};
