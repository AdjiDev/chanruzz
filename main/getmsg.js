const { getAggregateVotesInPollMessage } = require("../baileys")

async function HandlerPollMsg(sock, store) {
    async function getMessage(key) {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id);
            return msg?.message;
        }
        return {
            conversation: "Bot is online!",
        };
    }

    sock.ev.on("messages.update", async (chatUpdate) => {
        for (const { key, update } of chatUpdate) {
            if (update.pollUpdates && key.fromMe) {
                const pollCreation = await getMessage(key);
                if (pollCreation) {
                    const pollUpdate = await getAggregateVotesInPollMessage({
                        message: pollCreation,
                        pollUpdates: update.pollUpdates,
                    });
                    var toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]?.name;
                    if (toCmd == undefined) return;
                    var prefCmd = xprefix + toCmd;
                    sock.appenTextMessage(prefCmd, chatUpdate);
                }
            }
        }
    });

    sock.sendPoll = (jid, name = "", values = [], selectableCount = 1) => {
        return sock.sendMessage(jid, { poll: { name, values, selectableCount } });
    };
}

module.exports = {
    HandlerPollMsg
}