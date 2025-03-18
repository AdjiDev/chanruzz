require("../config/init");

async function AdminChangeHandler(sock) {
    sock.ev.on("group-participants.update", async (groupData) => {
        if (!groupData || !groupData.participants || !groupData.id) return;

        if (global.adminevent) {
            try {
                const metadata = await sock.groupMetadata(groupData.id);
                const participants = groupData.participants;

                for (let num of participants) {
                    let userName = sock.decodeJid(num).split("@")[0];
                    let messPromote = global.mess.promote
                        .replace("@tag", `@${userName}`)
                    let messDemote = global.mess.demote
                        .replace("@tag", `@${userName}`)

                    if (groupData.action === "promote") {
                        await sock.sendMessage(groupData.id, {
                            text: messPromote,
                            mentions: [num],
                        });
                    } else if (groupData.action === "demote") {
                        await sock.sendMessage(groupData.id, {
                            text: messDemote,
                            mentions: [num],
                        });
                    }
                }
            } catch (err) {
                console.error("Error handling admin changes:", err);
            }
        }
    });
}

module.exports = { AdminChangeHandler };
