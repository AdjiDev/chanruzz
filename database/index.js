const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const USER_DIR = path.join(__dirname, "user");

if (!fs.existsSync(USER_DIR)) {
    fs.mkdirSync(USER_DIR, { recursive: true });
}

const ROLES = [
    { minLevel: 20, name: 'Novice', expBonus: 0 },
    { minLevel: 40, name: 'Apprentice', expBonus: 5 },
    { minLevel: 80, name: 'Adept', expBonus: 10 },
    { minLevel: 160, name: 'Expert', expBonus: 15 },
    { minLevel: 320, name: 'Master', expBonus: 20 },
    { minLevel: 640, name: 'Grandmaster', expBonus: 25 },
    { minLevel: 1280, name: 'Legendary', expBonus: 30 },
    { minLevel: 25600, name: 'Mythic', expBonus: 35 }
].sort((a, b) => b.minLevel - a.minLevel);
 
function getUserFile(username) {
    return path.join(USER_DIR, `${username}.json`);
}

function readUserData(username) {
    const userFile = getUserFile(username);
    if (fs.existsSync(userFile)) {
        return JSON.parse(fs.readFileSync(userFile, "utf8"));
    }
    return null;
}

function saveUserData(userData) {
    const userFile = getUserFile(userData.name);
    fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));
}

function generateHexId() {
    return crypto.randomBytes(4).toString("hex");
}

function determineRole(level) {
    for (const role of ROLES) {
        if (level >= role.minLevel) {
            return role.name;
        }
    }
    return 'NPC';
}

function getRoleBonus(roleName) {
    const role = ROLES.find(r => r.name === roleName);
    return role ? role.expBonus : 0;
}

async function database(user = {}) {
    let userData = readUserData(user.name);

    if (!userData) {
        const initialLevel = user.level || 1;
        userData = {
            id: generateHexId(),
            name: user.name || "Guest",
            exp: user.exp || 0,
            level: initialLevel,
            role: determineRole(initialLevel),
            totalExp: user.exp || 0
        };
        saveUserData(userData);
    }

    return userData;
}

async function naikLevel(user) {
    let userData = readUserData(user.name);
    if (!userData) return "❌ User tidak ditemukan!";

    let currentLevel = userData.level || 1;
    let previousLevel = currentLevel;
    let expCurrent = userData.exp || 0;
    let expNeeded = calculateExpNeeded(currentLevel);
    let levelUps = 0;

    while (expCurrent >= expNeeded) {
        expCurrent -= expNeeded;
        currentLevel += 1;
        levelUps += 1;
        expNeeded = calculateExpNeeded(currentLevel);
    }

    userData.level = currentLevel;
    userData.exp = expCurrent;
    userData.role = determineRole(currentLevel);
    saveUserData(userData);

    if (levelUps > 0) {
        return `🎉 Selamat *${user.name}* (ID: ${userData.id})!
Naik level dari *Level ${previousLevel} ➡️ Level ${currentLevel}*.
Role saat ini: *${userData.role}*
📊 EXP ${expCurrent}/${expNeeded} (${((expCurrent / expNeeded) * 100).toFixed(1)}%) 
🔥 Butuh *${expNeeded - expCurrent} EXP lagi* untuk Level ${currentLevel + 1}`;
    }

    return `📊 *${user.name}* (ID: ${userData.id}):
Level: ${currentLevel} | EXP ${userData.exp}/${expNeeded} (${((userData.exp / expNeeded) * 100).toFixed(1)}%)
🔥 Butuh *${expNeeded - userData.exp} EXP lagi* untuk Level ${currentLevel + 1}`;
}

function calculateExpNeeded(level) {
    return Math.round(100 * Math.pow(level, 1.6) + (level * 50));
}

async function tambahExp(user, jumlah) {
    let userData = readUserData(user.name);
    if (!userData) return "❌ User tidak ditemukan!";

    const roleBonus = getRoleBonus(userData.role);
    const expGained = Math.round(jumlah * (1 + roleBonus));

    userData.exp += expGained;
    userData.totalExp += expGained;
    
    saveUserData(userData); 

    const bonusInfo = roleBonus > 0 ? ` (+${Math.round(roleBonus * 100)}% bonus role)` : '';
    return `✨ *${user.name}* (ID: ${userData.id}) mendapatkan *${expGained} EXP*${bonusInfo}
📈 Total EXP: ${userData.exp} | Level: ${userData.level}`;
}

module.exports = {
    database,
    naikLevel,
    tambahExp,
    saveUserData
};
