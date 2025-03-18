const axios = require('axios');

let plugins = async (m, { sock, args, pakaiLimit, isPremium, mess }) => {
    if (!isPremium) return m.reply(mess.premium);

    if (args.length < 1) return m.reply("❌ Format salah!\nGunakan: /genlogo [brandname], [prompt], [industry], [style]");

    let input = args.join(" ").split(",");

    let brandname = (input[0] || "").trim();
    let prompt = (input[1] || "Creative logo design").trim();
    let industry = (input[2] || "Technology").trim();
    let style = (input[3] || "Minimalist").trim();

    if (!brandname) return m.reply("❌ Mohon masukkan nama brand!\nContoh: /genlogo Brand, Deskripsi Prompt, Industry, Style");

    const validIndustries = [
        "Construction", "Education", "Beauty Spa", "Automotive", "Animals Pets", "Sport Fitness",
        "Retail", "Religius", "Real Estate", "Legal", "Internet", "Technology", "Home Family",
        "Medical Dental", "Restaurant", "Finance", "Nonprofit", "Entertainment"
    ];

    const validStyles = ["Minimalist", "3D", "Letter", "Hand-Drawn", "Badge", "Stamp"];

    if (!validIndustries.includes(industry)) {
        return m.reply(`⚠️ *Industry tidak valid!*\n\n✅ Pilih salah satu:\n${validIndustries.join(", ")}`);
    }

    if (!validStyles.includes(style)) {
        return m.reply(`⚠️ *Style tidak valid!*\n\n✅ Pilih salah satu:\n${validStyles.join(", ")}`);
    }

    let apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/logogenerator?brandname=${encodeURIComponent(brandname)}&prompt=${encodeURIComponent(prompt)}&industry=${encodeURIComponent(industry)}&style=${encodeURIComponent(style)}`;

    try {
        let response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        if (!response.data) throw new Error('Gagal mendapatkan file gambar.');

        await sock.sendMessage(m.chat, { react: { text: '🕛', key: m.key } });

        await sock.sendMessage(m.chat, {
            image: Buffer.from(response.data),
            caption: `🖼️ Logo untuk *${brandname}*\n📝 Prompt: *${prompt}*\n🏢 Industri: *${industry}*\n🎨 Style: *${style}*\n🔗 Sumber: AI Generator`
        }, { quoted: m });

        await sock.sendMessage(m.chat, { react: { text: '', key: m.key } });

        await pakaiLimit(5);
    } catch (error) {
        console.error("Error fetching logo:", error);
        return m.reply("⚠️ Terjadi kesalahan saat membuat logo.");
    }
};

plugins.cmd = ["genlogo", "logo"];
plugins.description = "Buat sebuah logo AI";
plugins.help = ["genlogo [opsi]"];
plugins.execute = plugins;

module.exports = plugins;
