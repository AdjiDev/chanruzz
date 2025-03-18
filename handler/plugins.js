require("../config/init");
const { pluginsLoader } = require("../lib/pluginsLoader");
const { checkPremiumUser } = require("../lib/premium");
const { database, isRegistered, registerUser } = require("../database");
const {
  kurangiLimit,
  cekLimit,
  saveLimits,
  muatLimit,
} = require("../lib/limits");

const activeUsers = new Map();
const usersNotified = new Set();
const LIMIT_RESET_INTERVAL = 30 * 60 * 1000; 
const DEFAULT_LIMIT = 50;

async function resetUserLimit() {
  const limits = await muatLimit();
  let updated = false;

  for (const [user, userData] of Object.entries(limits)) {
    if (
      !userData.lastReset ||
      Date.now() - userData.lastReset >= LIMIT_RESET_INTERVAL
    ) {
      userData.limit = Math.min(userData.limit + 1, DEFAULT_LIMIT);
      userData.lastReset = Date.now();
      updated = true;
    }
  }

  if (updated) await saveLimits(limits);
}

setInterval(resetUserLimit, LIMIT_RESET_INTERVAL);

module.exports = plugins = async (sock, m, chatUpdate, store) => {
  try {
    const getMessageBody = () => {
      return (
        m.message?.conversation ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption ||
        m.message?.extendedTextMessage?.text ||
        m.message?.buttonsResponseMessage?.selectedButtonId ||
        m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        m.message?.templateButtonReplyMessage?.selectedId ||
        ""
      );
    };

    if (m.mtype === "viewOnceMessageV2" || m.key.fromMe) return;

    const body = getMessageBody();
    const prefix = global.prefix.find((p) => body.startsWith(p)) || "/";

    const isPrivateChat = !m.key.remoteJid.includes("@g.us");
    const isPremium = checkPremiumUser(m.sender);

    if (isPrivateChat && !isPremium && !usersNotified.has(m.sender)) {
      usersNotified.add(m.sender);
      return;
    }

    const isOwner = Array.isArray(global.owner)
      ? global.owner.some(
          (creatorItem) =>
            creatorItem.replace(/[^0-9]/g, "") + "@s.whatsapp.net" === m.sender
        )
      : global.owner.replace(/[^0-9]/g, "") + "@s.whatsapp.net" === m.sender;
    
    const mess = {
      owner: global.mess.owner,
      premium: global.mess.premium,
    } 

    let userData = await database({ name: m.sender });
    if (!userData) return m.reply("❌ User tidak dalam database");

    if (!activeUsers.has(m.sender)) {
      activeUsers.set(m.sender, Date.now());
    }

    await pluginsLoader(sock);
    for (const category in global.plugins) {
      for (const pluginName in global.plugins[category]) {
        const plugin = global.plugins[category][pluginName];

        if (!plugin || (!plugin.cmd?.length && !plugin.pattern)) {
          console.log(`Skipping plugin ${pluginName}: Missing cmd or pattern`);
          continue;
        }

        if (!plugin.execute || typeof plugin.execute !== "function") {
          console.error(
            `Plugin ${pluginName} does not have a valid execute function.`
          );
          continue;
        }

        if (plugin.prefix !== false) {
          if (!body || !body.startsWith(prefix)) return;

          const [command, ...args] = body
            .slice(prefix.length)
            .trim()
            .split(/\s+/);

          const text = (q = args.join(" "));

          const pakaiLimit = async (jumlah) => {
            const sisaLimit = await cekLimit(m);
            if (sisaLimit < jumlah) {
              return m.reply(global.mess.limit);
            }

            await kurangiLimit(m, jumlah);
            await sock.sendMessage(m.chat, {
              text: `@${m.sender.split("@")[0]} Anda telah menggunakan ${jumlah} limit. Sisa limit anda: ${
                sisaLimit - jumlah
              }.`,
              mentions: [m.sender]
            });
          };

          const mixedMsg = m.quoted || m;
          const quoted =
            mixedMsg.mtype == "buttonsMessage"
              ? mixedMsg[Object.keys(mixedMsg)[1]]
              : mixedMsg.mtype == "templateMessage"
              ? mixedMsg.hydratedTemplate[
                  Object.keys(mixedMsg.hydratedTemplate)[1]
                ]
              : mixedMsg.mtype == "product"
              ? mixedMsg[Object.keys(mixedMsg)[0]]
              : m.quoted
              ? m.quoted
              : m;

          const mime = (quoted.msg || quoted).mimetype || "";
          const qmsg = quoted.msg || quoted;

          if (
            Array.isArray(plugin.cmd)
              ? plugin.cmd.includes(command)
              : plugin.cmd === command
          ) {
            try {
              await plugin.execute(m, {
                sock,
                args,
                prefix,
                pakaiLimit,
                command,
                text,
                quoted,
                mime,
                qmsg,
                mess,
                isOwner,
                isPremium,
              });
            } catch (err) {
              console.error(`Plugin error in ${pluginName}:`, err);
              m.reply(`${err.message}`);
            }
            return;
          }
        }

        if (plugin.pattern && plugin.pattern.test(body)) {
          try {
            await plugin.execute(m, { sock, args: [] });

            console.log(`Executed pattern-matching plugin: ${pluginName}`);
          } catch (err) {
            console.error(`Error plugin ${pluginName}:`, err);
          }
          return;
        }
      }
    }
  } catch (err) {
    console.error("Main Plugin Handler Error:", err);
  }
};
