require("../config/init");
const { exec } = require("child_process");
const util = require("util");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const { ytmp4, ytmp3, ttdl, igdl } = require("ruhend-scraper");
const fetch = require("node-fetch");

module.exports = executor = async (sock, m, msg, chatUpdate, store) => {
  try {
    const body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype === "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype === "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype === "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : m.mtype === "buttonsResponseMessage"
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype === "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype === "templateButtonReplyMessage"
        ? m.message.templateButtonReplyMessage.selectedId
        : "";

    const budy = typeof m.text === "string" ? m.text : "";
    const isGroup = m.key.remoteJid.endsWith("@g.us");
    const sender = m.sender;
    const creator = global.owner;
    const misc = m.quoted || m;
    const quoted =
      misc.mtype == "buttonsMessage"
        ? misc[Object.keys(misc)[1]]
        : misc.mtype == "templateMessage"
        ? misc.hydratedTemplate[Object.keys(misc.hydratedTemplate)[1]]
        : misc.mtype == "product"
        ? misc[Object.keys(misc)[0]]
        : m.quoted
        ? m.quoted
        : m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const qmsg = quoted.msg || quoted;
    const isOwner = Array.isArray(creator)
      ? creator.some(
          (creatorItem) =>
            creatorItem.replace(/[^0-9]/g, "") + "@s.whatsapp.net" === sender
        )
      : creator.replace(/[^0-9]/g, "") + "@s.whatsapp.net" === sender;

    const tt = async (url) => {
      const res = await ttdl(url);
      await sock.sendMessage(
        m.chat,
        {
          video: {
            url: res.video,
          },
          caption: "Success",
        },
        { quoted: m }
      );
    };
    const fetchJson = async (url) => {
      const res = await fetch(url);
      const data = await res.json();
      return JSON.stringify(data, null, 2);
    };

    if (isOwner && global.devmode) {
      const commands = {
        "=>": async () => {
          try {
            if (budy.length <= 3) return;
            const expression = budy.slice(3).trim();
            if (!expression) return;
            const result = await eval(`
                            (async () => {
                                ${expression}
                            })()
                        `);
            m.reply(`${util.format(result)}`);
          } catch (e) {
            console.error(e);
            m.reply(`${e}`);
          }
        },
        x: async () => {
          try {
            let evaled = await eval(budy.slice(2));
            evaled =
              typeof evaled !== "string"
                ? require("util").inspect(evaled)
                : evaled;
            m.reply(`${evaled}`);
          } catch (err) {
            m.reply(`${err}`);
          }
        },
        $: () => {
          if (budy.length <= 2) return;
          exec(budy.slice(2), (err, stdout) => {
            if (err) return m.reply(`${err}`);
            if (stdout) return m.reply(`${stdout}`);
          });
        },
      };

      const command = Object.keys(commands).find((cmd) => budy.startsWith(cmd));
      if (command) {
        await commands[command]();
      }
    }
  } catch (err) {
    console.error(err);
  }
};
