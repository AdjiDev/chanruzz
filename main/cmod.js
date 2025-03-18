const { proto } = require("../baileys")

/**
 * 
 * @param {socket} sock sockets
 */
async function CmodHandler(sock) {
    sock.cMod = (jid, copy, text = "", sender = sock.user.id, options = {}) => {
        //let copy = message.toJSON()
        let mtype = Object.keys(copy.message)[0];
        let isEphemeral = mtype === "ephemeralMessage";
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
        }
        let msg = isEphemeral
            ? copy.message.ephemeralMessage.message
            : copy.message;
        let content = msg[mtype];
        if (typeof content === "string") msg[mtype] = text || content;
        else if (content.caption) content.caption = text || content.caption;
        else if (content.text) content.text = text || content.text;
        if (typeof content !== "string")
            msg[mtype] = {
                ...content,
                ...options,
            };
        if (copy.key.participant)
            sender = copy.key.participant = sender || copy.key.participant;
        else if (copy.key.participant)
            sender = copy.key.participant = sender || copy.key.participant;
        if (copy.key.remoteJid.includes("@s.whatsapp.net"))
            sender = sender || copy.key.remoteJid;
        else if (copy.key.remoteJid.includes("@broadcast"))
            sender = sender || copy.key.remoteJid;
        copy.key.remoteJid = jid;
        copy.key.fromMe = sender === sock.user.id;

        return proto.WebMessageInfo.fromObject(copy);
    };
}

module.exports = { CmodHandler} 