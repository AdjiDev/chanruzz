const { smsg } = require("../lib/serialize");
const fs = require("fs");
const path = require("path");
const { text } = require("../lib/color");
const { nocache, uncache } = require("../lib/loader");
require("../config/init");

async function LoadHandler(sock, store) {
    sock.public = true;
    const ownerNumber = global.owner + "@s.whatsapp.net";
    
    sock.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            let mek = chatUpdate.messages[0];
            if (!mek.message) return;
            
            mek.message = Object.keys(mek.message)[0] === "ephemeralMessage" 
                ? mek.message.ephemeralMessage.message 
                : mek.message;

            if (mek.key && mek.key.remoteJid === "status@broadcast") {
                if (!sock.public && !mek.key.fromMe && chatUpdate.type === "notify") return;
            }
            
            if (!sock.public && mek.key.remoteJid !== ownerNumber) {
                return; 
            }
            
            if (mek.key.id.startsWith("BAE5") && mek.key.id.length === 16) return;
            
            const m = smsg(sock, mek, store);
            const handlerFiles = fs.readdirSync(path.join(__dirname, '../handler'));

            handlerFiles.forEach(file => {
                if (file.endsWith('.js')) {
                    try {
                        const handler = require(path.join(__dirname, '../handler', file));
                        if (typeof handler === 'function') {
                            handler(sock, m, chatUpdate, store);
                        }
                    } catch (error) {
                        console.error(`[${text.bold}${text.red}!${text.reset}] ${file}`, error);
                    }
                }
            });
        } catch (err) {
            console.error(`[${text.bold}${text.red}!${text.reset}]`, err);
        }
    });

    const handlerFolderPath = path.join(__dirname, '../handler');
    fs.watch(handlerFolderPath, { recursive: true }, async (eventType, filename) => {
        if (!filename || !filename.endsWith('.js')) return;

        const filePath = path.join(handlerFolderPath, filename);

        if (eventType === 'rename' || eventType === 'change') {
            if (fs.existsSync(filePath)) {
                console.log(`[${text.green}INFO${text.reset}] ${filename} has been added or modified.`);
                await nocache(filePath, () => {
                    console.log(`[${text.green}INFO${text.reset}] ${filename} has been reloaded.`);
                });
            } else {
                console.log(`[${text.red}ERROR${text.reset}] ${filename} was deleted.`);
                await uncache(filePath);
            }
        }
    });

    console.log(`[${text.green}INFO${text.reset}] File watcher started on handler folder.`);
}

module.exports = { LoadHandler };
