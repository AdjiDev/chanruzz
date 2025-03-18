let plugin = async (m, { sock }) => {
    try {
        let data = await sock.groupFetchAllParticipating();
        let groups = Object.values(data);

        if (groups.length === 0) {
            return m.reply("*Bot tidak tergabung dalam grup mana pun.*");
        }

        let pesan = `*📋 DAFTAR GROUP 📋*\n\n`;
        groups.forEach((group, index) => {
            let owner = group.owner ? `wa.me/${group.owner.split("@")[0]}` : "Tidak diketahui";
            let status = group.announce ? "🔒 Ditutup" : "✅ Terbuka";

            pesan += `*${index + 1}. ${group.subject}*\n`;
            pesan += `- 🔹 *ID:* ${group.id}\n`;
            pesan += `- 👥 *Anggota:* ${group.size} orang\n`;
            pesan += `- 👑 *Owner:* ${owner}\n`;
            pesan += `- 📌 *Status:* ${status}\n`;
            pesan += `───────────────────────\n`;
        });

        m.reply(pesan);
    } catch (error) {
        console.error(error);
        m.reply("❌ Terjadi kesalahan saat mengambil daftar grup.");
    }
};

plugin.cmd = ['listgroup', 'listgc', 'listgrup'];
plugin.description = "Tampilkan semua grup yang diikuti bot";
plugin.help = ['listgroup', 'listgc', 'listgrup'];
plugin.execute = plugin;

module.exports = plugin;
