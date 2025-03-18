require("../config/init")
const { pickRandom } = require("../lib/func")

async function StatusView(sock) {
    sock.ev.on("messages.upsert", async (chatUpdate) => {
        const mek = chatUpdate.messages[0];
        if (global.view && !global.blacklist.includes(mek.key.remoteJid)) {
            if (mek.key && mek.key.remoteJid === "status@broadcast") {
                const bot = await sock.decodeJid(sock.user.id);
                await sock.readMessages([mek.key, bot]);

                if (mek.key.fromMe) return;

                await sock.sendMessage(mek.key.remoteJid, {
                    react: {
                        text: `${pickRandom(global.emoji)}`,
                        key: mek.key,
                    },
                }, {
                    statusJidList: [mek.key.participant, bot],
                }).catch(() => { });
            }
        }
    });
}

module.exports = {
    StatusView
}