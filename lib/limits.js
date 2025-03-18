const fs = require("fs").promises;
const path = require("path");

const LIMITS_FILE_PATH = path.join(__dirname, "../", "src/limits.json");
const DEFAULT_LIMIT = 50;

async function muatLimit() {
    try {
        const data = await fs.readFile(LIMITS_FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return {}; 
    }
}

async function saveLimits(data) {
    try {
        await fs.writeFile(LIMITS_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
    } catch (error) {
        console.error("Failed to save limits:", error);
    }
}

async function getUserLimit(m) {
    const limits = await muatLimit();
    if (!limits[m.sender]) {
        limits[m.sender] = { limit: DEFAULT_LIMIT };
        await saveLimits(limits);
    }
    return limits[m.sender];
}

async function modifyLimit(m, amount) {
    const limits = await muatLimit();
    const userLimit = limits[m.sender] || { limit: DEFAULT_LIMIT };

    userLimit.limit = Math.max(0, userLimit.limit + amount);
    limits[m.sender] = userLimit;
    await saveLimits(limits);

    return userLimit;
}

async function cekLimit(m) {
    const limits = await muatLimit();
    return limits[m.sender]?.limit ?? DEFAULT_LIMIT;
}

module.exports = {
    limitBot: getUserLimit,
    tambahLimit: (m, amount = 1) => modifyLimit(m, amount),
    kurangiLimit: (m, amount = 1) => modifyLimit(m, -amount),
    cekLimit,
    muatLimit,
    saveLimits
};
