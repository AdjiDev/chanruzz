async function HandlerButton(sock) {
  sock.sendButton = async (jid, button, options = {}) => {
    try {
      await sock.sendMessage(
        jid,
        {
          text: button.text || "",
          footer: button.footer || null,
          buttons: button.buttons || [],
          viewOnce: button.viewOnce ?? true,
          headerType: button.headerType ?? 4,
          ...options,
        },
        options
      );
    } catch (error) {
      console.error("Error sending button message:", error);
    }
  };

  sock.sendImgButton = async (jid, button, options = {}) => {
    try {
      await sock.sendMessage(
        jid,
        {
          image: button.image ? { url: button.image } : undefined,
          caption: button.caption || "",
          footer: button.footer || null,
          buttons: button.buttons || [],
          viewOnce: button.viewOnce ?? true,
          headerType: button.headerType ?? 4,
          ...options,
        },
        options
      );
    } catch (error) {
      console.error("Error sending image button message:", error);
    }
  };

  sock.sendVideoButton = async (jid, button, options = {}) => {
    try {
      await sock.sendMessage(
        jid,
        {
          video: button.video ? { url: button.video } : undefined,
          caption: button.caption || "",
          footer: button.footer || null,
          buttons: button.buttons || [],
          viewOnce: button.viewOnce ?? true,
          headerType: button.headerType ?? 4,
          ...options,
        },
        options
      );
    } catch (error) {
      console.error("Error sending video button message:", error);
    }
  };
}

module.exports = {
  HandlerButton,
};
