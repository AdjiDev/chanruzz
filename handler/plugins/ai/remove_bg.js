const { uploadFileUgu } = require("../../../lib/func");
const fetch = require("node-fetch");
const fs = require("fs");

module.exports = {
    cmd: ["removebg", "rmbg"],
    description: "Hapus latar belakang gambar",
    help: ["removebg", "rmbg"],
    execute: async (m, { sock, quoted, qmsg }) => {
        try {
            if (!qmsg || !qmsg.mimetype || !qmsg.mimetype.includes("image")) {
                return sock.sendMessage(m.chat, { text: "Kirim atau reply gambar untuk menghapus latar belakang." });
            }

            const media = await sock.downloadAndSaveMediaMessage(qmsg);
            const files = await uploadFileUgu(media);

            await sock.sendMessage(m.chat, {
                react: {
                    text: "🕛",
                    key: m.key
                }
            });

            let apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/removebg?imageUrl=${encodeURIComponent(files.url)}&type=auto&shadow=false`;

            let res = await fetch(apiUrl);
            if (!res.ok) throw new Error(`Gagal menghapus latar belakang: ${res.statusText}`);

            let buffer = await res.buffer();

            await sock.sendMessage(m.chat, {
                image: buffer,
                caption: "Ini dia hasilnya!"
            });

            fs.unlinkSync(media);

        } catch (error) {
            console.error(error);
            await sock.sendMessage(m.chat, { text: "Terjadi kesalahan saat menghapus latar belakang. Coba lagi nanti." });
        }
    }
};
