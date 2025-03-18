// config/init.js
const path = require("path");
const fs = require("fs")
const chalk = require("chalk")

// auth
global.useQr = true

// status broadcast view
global.emoji = ["🤣", "😝", "😄", "🤔", "😂", "🙌", "😒", "🎶"]
global.view = true

// config bot
global.botname = "ichanbot"
global.botnumber = "62xx"
//global.thumb = fs.readFileSync("./src/thumbnail.jpg")
global.thumb2 = "https://imgkub.com/images/2025/03/16/ayang.jpg"
//global.button = false
global.prefix = ["/", "!", ".", "#"] // default prefix is "/" if no prefix provided

// config owner
global.ownername = "Chanruzzdev | Adjidev"
global.owner = ["62xx"] 
global.devmode = true // use at your own risk set to false for safe usage
global.email = "admin@adjisandev.tech"

// setting
global.log = false 
global.welcome = false
global.adminevent = false
global.packname = ""
global.author = "ιƈԋαɳɾυȥȥ シ xd"
global.blacklist = [""] // works with group and chat example ["1234567@g.us", "123456@s.whatsapp.net"]
//global.aidelay = 3500 // delay for AI response
global.aiprompt = `Anda adalah IchanAI, asisten virtual yang penuh perhatian dan peduli. Jawablah setiap pertanyaan dengan bijaksana, penuh empati, dan pastikan untuk memberikan informasi yang akurat. Hindari memberikan kode atau instruksi teknis, dan lebih fokus pada memberikan jawaban yang mudah dipahami dan membantu. Jika Anda tidak yakin tentang sesuatu, katakan dengan jujur tanpa keraguan.`;
//global.autoai = true
//global.leveling = true

// session manager
global.clear = false
global.cleartime = 15 * 60 * 1000 // 15 min
global.session = "./src/temp/session"
global.logFile = path.join(__dirname, "../log/session-manager.log");

/**
 * @groupname group name
 * @tag tag user only work on welcome, farewell and admin event
 * @membercount group chat member count
 */
global.mess = {
    welcome: "👋 Hai @tag selamat datang di *@nama grup*! \Grup ini sekarang memiliki total anggota *@membercount* terima kasih sudah join di grup ini.",
    farewell: "🥀 selamat tinggal @tag \n\nGrup ini sekarang memiliki total anggota *@jumlahanggota*.",
    promote: "🎉 @tag telah menjadi admin! 🎩",
    demote: "😢 @tag telah berakhir menjadi admin",
    premium: "Anda bukan user premium!",
    owner: "Anda bukan owner!",
    limit: "Limit anda sudah habis!",
    rejectCall: "Maaf, saya tidak bisa menerima panggilan!",
    admin: "Anda bukan admin!",
    group: "Perintah ini hanya bisa digunakan di grup!",
    botAdmin: "Jadikan saya admin terlebih dahulu!",
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update'${__filename}'`))
    delete require.cache[file]
    require(file)
})