require("../../config/init");
const { checkPremiumUser } = require("../../lib/premium")
const { cekLimit } = require("../../lib/limits")

module.exports = class mess {
    static owner(m, sock) {
        return m.reply(`${global.mess.owner}`);
    }

    static premium(m, sock) {
        const isPremium = checkPremiumUser(m.sender);
        if (!isPremium) return m.reply(`${global.mess.premium}`); 
    }

    static limit(m, sock) {
        const limit = cekLimit(m.sender);
        if (limit <= 0) return m.reply(`${global.mess.limit}`);
    }
}

