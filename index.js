const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const installBaileys = () => {
    return new Promise((resolve, reject) => {
        console.log("Checking if baileys dependencies are installed...");
        exec('npm run install_baileys', (err, stdout, stderr) => {
            if (err) {
                reject(`Error during baileys installation: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
};

const checkAndInstallModules = async () => {
    const rootNodeModules = path.join(__dirname, 'node_modules');
    const baileysNodeModules = path.join(__dirname, 'baileys', 'node_modules');

    try {
        if (!fs.existsSync(rootNodeModules)) {
            console.log('Root node_modules not found, installing...');
            await installModules(__dirname);
        } else {
            console.log('Root node_modules already installed.');
        }

        if (!fs.existsSync(baileysNodeModules)) {
            console.log('Baileys node_modules not found, installing...');
            await installBaileys();
        } else {
            console.log('Baileys node_modules already installed.');
        }
    } catch (error) {
        console.error(`Failed to install required modules: ${error}`);
    }
};

require("./config/init");
const { clearCache } = require("./lib/clearsesi");
const start_bot = require("./main/_start");

(async () => {
    try {
        await checkAndInstallModules();
        console.log("Starting bot...");
        await start_bot();
        console.log("Bot started!");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();

const StartClear = async () => {
    setInterval(clearCache, global.cleartime);
    clearCache().catch(err => console.error(err));
};

StartClear();
