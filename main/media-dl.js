const { downloadContentFromMessage } = require("../baileys");
const fs = require("fs");
const FileType = require("file-type");
const path = require("path");

async function HandlerDownloadSocket(sock) {
  sock.downloadMediaMessage = async (message) => {
    try {
      let mime = (message.msg || message).mimetype || "";
      let messageType = message.mtype
        ? message.mtype.replace(/Message/gi, "")
        : mime.split("/")[0];

      const stream = await downloadContentFromMessage(message, messageType);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      return buffer;
    } catch (error) {
      console.error("Error downloading media:", error);
      return null;
    }
  };

  sock.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true
  ) => {
    try {
      let quoted = message.msg ? message.msg : message;
      let mime = (message.msg || message).mimetype || "";
      let messageType = message.mtype
        ? message.mtype.replace(/Message/gi, "")
        : mime.split("/")[0];

      const stream = await downloadContentFromMessage(quoted, messageType);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      let type = await FileType.fromBuffer(buffer);
      if (!type) {
        const ext = path.extname(filename);
        if (ext) {
          type = {
            ext: ext.substring(1),
            mime: mime || "application/octet-stream",
          };
        } else {
          return null;
        }
      }

      const baseDir = path.join(__dirname, "..", "media");
      let folder;
      if (type.mime.startsWith("image/")) {
        folder = "image";
      } else if (type.mime.startsWith("video/")) {
        folder = "video";
      } else if (type.mime.startsWith("audio/")) {
        folder = "audio";
      } else if (type.mime.startsWith("application/")) {
        folder = "document";
      } else {
        folder = "other";
      }

      const targetDir = path.join(baseDir, folder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const uniqueFileName = `${filename}_${Date.now()}.${
        attachExtension ? type.ext : "bin"
      }`;
      const trueFileName = path.join(targetDir, uniqueFileName);

      await fs.writeFileSync(trueFileName, buffer);
      console.log(`Media saved to: ${trueFileName}`);
      return trueFileName;
    } catch (error) {
      console.error("Error saving media:", error);
      return null;
    }
  };

  sock.clearMedia = () => {
    const mediaDirs = ["image", "audio", "video", "document", "other"];
    const baseDir = path.join(__dirname, "..", "media");

    mediaDirs.forEach((dir) => {
      const targetDir = path.join(baseDir, dir);
      if (fs.existsSync(targetDir)) {
        fs.readdirSync(targetDir).forEach((file) => {
          const filePath = path.join(targetDir, file);
          fs.unlinkSync(filePath);
        });
        console.log(`Cleared media in: ${targetDir}`);
      }
    });
  };
}

module.exports = {
  HandlerDownloadSocket,
};
