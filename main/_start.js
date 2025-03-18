// main/_start.js
require("../config/init")
const {
    default: WaConnection,
    makeInMemoryStore,
    makeCacheableSignalKeyStore,
    Browsers,
    useMultiFileAuthState,
    jidDecode,
    //proto
} = require("../baileys")
const pino = require("pino")
const NodeCache = require("node-cache")
const groupCache = new NodeCache({stdTTL: 5 * 60, useClones: false})
const messageCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });
const readline = require("readline")

// local module/function
const { smsg } = require("../lib/serialize")
const { text } = require("../lib/color")
const { ConnectionHandler } = require("./connection")
const { LoadHandler } = require("./load-handler")
const { ContactHandler } = require("./contact-socket")
const { MessageHandler } = require("./msg-socket")
const { CmodHandler } = require("./cmod")
const { HandlerCopyNForward } = require("./copyNForward")
const { HandlerDownloadSocket } = require("./media-dl")
const { StatusView } = require("./SBV")
const { ConverterSticker } = require("./module-01")
const { HandlerPollMsg } = require("./getmsg")
const { HandlerButton } = require("./buttonMsg")
const { WelcomeNFarewell } = require("./welcome")
const { AdminChangeHandler } = require("./AdminEvent")
const { TTSHandler } = require("./eSpeak")
const { rejectCall } = require("./rejectCall")
const { logger } = require("../main")

const store = makeInMemoryStore({
    logger: pino().child({
        level: "silent",
        stream: "store"
    })
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function start_bot() {
    const { state, saveCreds } = await useMultiFileAuthState(global.session);
    const msgRetryCounterCache = new NodeCache();

    const sock = WaConnection({
        logger: pino({ level: "silent" }),
        printQRInTerminal: global.useQr,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(
                state.keys,
                pino({ level: "fatal" }).child({ level: "fatal" })
            ),
        },
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: true,
        fireInitQueries: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        browser: Browsers.windows("Edge"),
        cachedGroupMetadata: async (jid) => groupCache.get(jid),
        msgRetryCounterCache
    });
    // creds and serialize whatsapp messages
    store.bind(sock.ev);
    sock.serializeM = (m) => smsg(sock, m, store);
    sock.ev.on("creds.update", saveCreds);
    
    if (!global.useQr && !sock.authState.creds.registered) {
        const number = await question(`[${text.green}+${text.reset}] Enter number start with country code example (${text.bold}6281234567${text.reset}):\n(${text.dim}${global.botname}${text.reset}):~$ `);
        try {
            setTimeout(async () => {
                let code = await sock.requestPairingCode(number);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log("")
                console.log(`PAIRING CODE : [${text.bold}${text.green}${code}${text.reset}]`);
            }, 3000);
        } catch (e) {
            console.error(`[${text.bgRed}FATAL${text.reset}] ${text.italic}${e}${text.reset}`)
        }
    }

    sock.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return (
                (decode.user && decode.server && decode.user + "@" + decode.server) ||
                jid
            );
        } else return jid;
    };

    sock.ev.on('groups.update', async ([event]) => {
        const metadata = await sock.groupMetadata(event.id)
        groupCache.set(event.id, metadata)
    })
    
    sock.ev.on("group-participants.update", async (event) => {
        console.log(event);
        try {
            const groupMetadata = await sock.groupMetadata(event.id).catch(() => null);
            if (!groupMetadata) {
                //console.log(`⚠️ Bot is no longer in the group: ${event.id}`);
                return;
            }
            groupCache.set(event.id, groupMetadata);
        } catch (error) {
            //console.error("❌ Failed to fetch group metadata:", error);
        }
    });
    

    sock.ev.on('message.update', (updates) => {
        updates.forEach(update => {
            messageCache.set(update.key.id, update);
        });
    });
    
    sock.ev.on('message-receipt.update', (updates) => {
        updates.forEach(update => {
            messageCache.set(update.key.id, update);
        });
    });
    
    sock.ev.on('message.media-update', (updates) => {
        updates.forEach(update => {
            messageCache.set(update.key.id, update);
        });
    });

    // load a function
    await LoadHandler(sock, store);
    await ConnectionHandler(sock, start_bot);
    await ContactHandler(sock, store);
    await HandlerPollMsg(sock, store);
    await CmodHandler(sock);
    await MessageHandler(sock);
    await HandlerCopyNForward(sock);
    await HandlerDownloadSocket(sock);
    await StatusView(sock);
    await ConverterSticker(sock);
    await HandlerButton(sock);
    await WelcomeNFarewell(sock);
    await AdminChangeHandler(sock);
    await TTSHandler(sock);
    await rejectCall(sock);
    await logger(sock)

    return sock;
}

module.exports = start_bot;