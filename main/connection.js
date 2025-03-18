const { DisconnectReason } = require("../baileys")
const { Boom } = require("@hapi/boom")
const { text } = require("../lib/color")

async function ConnectionHandler(sock, func) {
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        try {
            if (connection === "close") {
                let reason = new Boom(lastDisconnect?.error)?.output.statusCode;

                switch (reason) {
                    case DisconnectReason.badSession:
                        console.log(`Bad Session File, Please Delete Session and Scan Again`);
                        break;
                    case DisconnectReason.connectionClosed:
                        console.log("Connection closed, reconnecting....");
                        break;
                    case DisconnectReason.connectionLost:
                        console.log("Connection Lost from Server, reconnecting...");
                        break;
                    case DisconnectReason.connectionReplaced:
                        console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
                        break;
                    case DisconnectReason.loggedOut:
                        console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
                        break;
                    case DisconnectReason.restartRequired:
                        console.log("Restart Required, Restarting...");
                        break;
                    case DisconnectReason.timedOut:
                        console.log("Connection TimedOut, Reconnecting...");
                        break;
                    default:
                        console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
                        break;
                }
                await func();
            }

            if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
                console.log(`[${text.green}INFO${text.reset}] Connecting...`);
            }

            if (update.connection == "open" || update.receivedPendingNotifications == "true") {
                console.log(`${text.italic}${text.underline}Success connected to:${text.reset}`);
                console.log(JSON.stringify(sock.user, null, 1));
            }
        } catch (err) {
            console.log("Error in connection.update:", err);
            await func();
        }
    });
}

module.exports = {
    ConnectionHandler
}