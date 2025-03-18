const fs = require("fs")
const axios = require('axios');
const FormData = require('form-data');

function pickRandom(data) {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
}

function sleep(x) {
    return new Promise(resolve => setTimeout(resolve, x));
}

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(global.logFile, logMessage, 'utf8');
}

async function uploadFileUgu(input) {
    return new Promise(async (resolve, reject) => {
        const form = new FormData();
        form.append("files[]", fs.createReadStream(input));
        
        await axios({
            url: "https://uguu.se/upload.php",
            method: "POST",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
                ...form.getHeaders()
            },
            data: form
        }).then((data) => {
            resolve(data.data.files[0]);
        }).catch((err) => reject(err));
    });
}

function Replace(template, objectOrFunc) {
    return template.replace(/@(\w+)/g, (match, key) => {
        if (typeof objectOrFunc === "function") {
            return objectOrFunc(key) || match; 
        } else if (typeof objectOrFunc === "object" && objectOrFunc !== null) {
            return objectOrFunc[key] || match; 
        }
        return match; 
    });
}

module.exports = {
    pickRandom,
    sleep,
    log,
    Replace,
    uploadFileUgu
}
