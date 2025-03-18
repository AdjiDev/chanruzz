
/**
 * 
 * @param {*} sock socket
 */
async function MessageHandler(sock) {
    sock.sendText = (jid, text, quoted = "", options) =>
        sock.sendMessage(
            jid,
            {
                text: text,
                ...options,
            },
            {
                quoted,
                ...options,
            }
        );
    
    sock.sendReact = (jid, emoji, key, options) => {
        sock.sendMessage(jid, {
            react: {
                text: emoji,
                key: key
            },
            ...options
        });
    };

    sock.sendImage = async (jid, path, caption = "", quoted = "", options) => {
        let buffer = Buffer.isBuffer(path)
            ? path
            : /^data:.*?\/.*?;base64,/i.test(path)
                ? Buffer.from(path.split`,`[1], "base64")
                : /^https?:\/\//.test(path)
                    ? await await getBuffer(path)
                    : fs.existsSync(path)
                        ? fs.readFileSync(path)
                        : Buffer.alloc(0);
        return await sock.sendMessage(
            jid,
            {
                image: buffer,
                caption: caption,
                ...options,
            },
            {
                quoted,
            }
        );
    };

    sock.sendAudio = async (jid, path, quoted = "", ptt = false, options) => {
        let buffer = Buffer.isBuffer(path)
          ? path
          : /^data:.*?\/.*?;base64,/i.test(path)
          ? Buffer.from(path.split`,`[1], "base64")
          : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
          ? fs.readFileSync(path)
          : Buffer.alloc(0);
        return await sock.sendMessage(
          jid,
          { audio: buffer, ptt: ptt, ...options },
          { quoted }
        );
      };
    
      sock.sendVideo = async (
        jid,
        path,
        caption = "",
        quoted = "",
        gif = false,
        options
      ) => {
        let buffer = Buffer.isBuffer(path)
          ? path
          : /^data:.*?\/.*?;base64,/i.test(path)
          ? Buffer.from(path.split`,`[1], "base64")
          : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
          ? fs.readFileSync(path)
          : Buffer.alloc(0);
        return await sock.sendMessage(
          jid,
          { video: buffer, caption: caption, gifPlayback: gif, ...options },
          { quoted }
        );
      };

    sock.sendContact = async (jid, kon, quoted = "", opts = {}) => {
        let list = [];
        for (let i of kon) {
            list.push({
                displayName: await sock.getName(i),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await sock.getName(
                    i
                )}\nFN:${await sock.getName(i)}\nitem1.TEL;waid=${i.split("@")[0]}:${i.split("@")[0]
                    }\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
            });
        }
        sock.sendMessage(
            jid,
            {
                contacts: { displayName: `${list.length} Contact`, contacts: list },
                ...opts,
            },
            { quoted }
        );
    };
}

module.exports = { MessageHandler }