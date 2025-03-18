const {
    generateForwardMessageContent,
    generateWAMessageFromContent
  } = require("../baileys");

async function HandlerCopyNForward(sock) {
    sock.copyNForward = async (
        jid,
        message,
        forceForward = false,
        options = {}
    ) => {
        let vtype;
        if (options.readViewOnce) {
            message.message =
                message.message &&
                    message.message.ephemeralMessage &&
                    message.message.ephemeralMessage.message
                    ? message.message.ephemeralMessage.message
                    : message.message || undefined;
            vtype = Object.keys(message.message.viewOnceMessage.message)[0];
            delete (message.message && message.message.ignore
                ? message.message.ignore
                : message.message || undefined);
            delete message.message.viewOnceMessage.message[vtype].viewOnce;
            message.message = {
                ...message.message.viewOnceMessage.message,
            };
        }
        let mtype = Object.keys(message.message)[0];
        let content = await generateForwardMessageContent(message, forceForward);
        let ctype = Object.keys(content)[0];
        let context = {};
        if (mtype != "conversation") context = message.message[mtype].contextInfo;
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo,
        };
        const waMessage = await generateWAMessageFromContent(
            jid,
            content,
            options
                ? {
                    ...content[ctype],
                    ...options,
                    ...(options.contextInfo
                        ? {
                            contextInfo: {
                                ...content[ctype].contextInfo,
                                ...options.contextInfo,
                            },
                        }
                        : {}),
                }
                : {}
        );
        await sock.relayMessage(jid, waMessage.message, {
            messageId: waMessage.key.id,
        });
        return waMessage;
    };
}

module.exports = {
    HandlerCopyNForward
}