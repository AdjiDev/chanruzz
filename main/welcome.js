require("../config/init");

async function WelcomeNFarewell(sock) {
    sock.ev.on("group-participants.update", async (groupData) => {
        if (!global.welcome) return; // Ensure welcome messages are enabled

        try {
            const metadata = await sock.groupMetadata(groupData.id);
            const participants = groupData.participants;

            for (let num of participants) {

                let memberCount = metadata.participants.length;
                let userName = sock.decodeJid(num).split("@")[0];

                let messWelcome = global.mess.welcome
                    .replace("@tag", `@${userName}`)
                    .replace("@groupname", metadata.subject)
                    .replace("@membercount", memberCount);

                let messLeft = global.mess.farewell
                    .replace("@tag", `@${userName}`)
                    .replace("@groupname", metadata.subject)
                    .replace("@membercount", memberCount);

                if (groupData.action === "add") {
                    await sock.sendMessage(groupData.id, {
                        text: messWelcome,
                        mentions: [num],
                    });
                } else if (groupData.action === "remove") {
                    await sock.sendMessage(groupData.id, {
                        text: messLeft,
                        mentions: [num],
                    });
                }
            }
        } catch (err) {
            console.error("Error handling group update:", err);
        }
    });
}

module.exports = { WelcomeNFarewell };
