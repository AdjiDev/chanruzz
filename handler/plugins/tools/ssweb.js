let axios = require('axios')

let plugins = async (m, { sock, pakaiLimit, args }) => {
    let apiUrl = `https://fastrestapis.fasturl.cloud/tool/screenshot?url=${args[0]}&width=1280&height=800&delay=0&fullPage=false&darkMode=false&type=jpeg`
    let res = await axios.get(apiUrl, { responseType: 'arraybuffer' })
    await sock.sendMessage(m.chat, { react: {
        text: '🕛',
        key: m.key
    }})
    if (!res.data) throw new Error('File not found')
    await sock.sendMessage(m.chat, { image: Buffer.from(res.data) }, { quoted: m })
    await sock.sendMessage(m.chat, { react: {
        text: '',
        key: m.key
    }})
    await pakaiLimit(1)
}

plugins.cmd = ['ssweb', 'ss']
plugins.description = 'Mengambil screenshot dari sebuah website'
plugins.help = ['ssweb [url]', 'ss [url]']
plugins.execute = plugins

module.exports = plugins