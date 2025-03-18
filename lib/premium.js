const fs = require("fs");
const toMs = require("ms");

const PREMIUM_FILE = "./src/premium.json";

const readPremiumData = () => {
	try {
		return JSON.parse(fs.readFileSync(PREMIUM_FILE, "utf-8"));
	} catch (error) {
		console.error("❌ Error membaca premium.json:", error);
		return [];
	}
};

const savePremiumData = (data) => {
	try {
		fs.writeFileSync(PREMIUM_FILE, JSON.stringify(data, null, 2));
	} catch (error) {
		console.error("❌ Error menyimpan premium.json:", error);
	}
};

const addPremiumUser = (userId, duration) => {
	let premium = readPremiumData();
	const existingIndex = premium.findIndex((user) => user.id === userId);

	if (existingIndex !== -1) {
		premium[existingIndex].expired += toMs(duration);
	} else {
		const newUser = { id: userId, expired: Date.now() + toMs(duration) };
		premium.push(newUser);
	}

	savePremiumData(premium);
};

const getPremiumPosition = (userId) => {
	let premium = readPremiumData();
	return premium.findIndex((user) => user.id === userId);
};

const getPremiumExpired = (userId) => {
	let premium = readPremiumData();
	const user = premium.find((user) => user.id === userId);
	return user ? user.expired : null;
};

const checkPremiumUser = (userId) => {
	let premium = readPremiumData();
	return premium.some((user) => user.id === userId);
};

const expiredPremiumCheck = (sock) => {
	const checkExpiration = () => {
		let premium = readPremiumData();
		const now = Date.now();

		const activeUsers = premium.filter((user) => {
			if (now >= user.expired) {
				console.log(`⚠️ Premium expired: ${user.id}`);
				sock.sendMessage(user.id, { text: "⚠️ Premium Anda telah habis, silakan beli lagi!" });
				return false; 
			}
			return true;
		});

		if (activeUsers.length !== premium.length) {
			savePremiumData(activeUsers);
		}

		setTimeout(checkExpiration, 60000);
	};

	checkExpiration();
};

const getAllPremiumUser = () => {
	let premium = readPremiumData();
	return premium.map((user) => user.id);
};

module.exports = {
	addPremiumUser,
	getPremiumExpired,
	getPremiumPosition,
	expiredPremiumCheck,
	checkPremiumUser,
	getAllPremiumUser,
};
