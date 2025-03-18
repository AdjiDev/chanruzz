require("../config/init");
const fs = require("fs").promises;
const { sleep, log } = require("./func");

async function clearCache() {
    if (!global.clear) return;

    try {
        const files = await fs.readdir(global.session);
        const filteredArray = files.filter(
            (item) =>
                item.startsWith("pre-key") ||
                item.startsWith("sender-key") ||
                item.startsWith("session-") ||
                item.startsWith("app-state")
        );

        log(`Detected ${filteredArray.length} junk files`);

        if (filteredArray.length === 0) {
            log("No junk files to delete.");
            return;
        }

        let teks = `Detected ${filteredArray.length} junk files:\n\n`;
        filteredArray.forEach((e, i) => {
            teks += `${i + 1}. ${e}\n`;
        });

        console.log(teks);
        log(teks);

        await sleep(2000);

        log("Deleting junk files...");
        for (const file of filteredArray) {
            try {
                await fs.unlink(`${global.session}/${file}`);
                log(`Deleted file: ${file}`);
            } catch (error) {
                log(`Error deleting file: ${file} - ${error.message}`);
            }
        }

        await sleep(2000);
    } catch (err) {
        log(`Unable to scan directory: ${err.message}`);
    }
}

module.exports = {
    clearCache,
};
