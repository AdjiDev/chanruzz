module.exports = {
  cmd: ["ping"],
  description: "Mengukur latensi bot",
  help: ["ping"],
  execute: async (m, { sock }) => {
    const start = Date.now();
    await sock.sendMessage(m.key.remoteJid, { text: "Pong!" }, { quoted: m });
    const end = Date.now();
    await sock.sendMessage(
      m.key.remoteJid,
      { text: `Response time: ${end - start}ms` },
      { quoted: m }
    );
  },
};
