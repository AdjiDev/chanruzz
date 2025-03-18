const chalk = require("chalk");
const util = require("util");

exports.logger = async (conn) => {
    if (!conn.logger) conn.logger = {}; 

    Object.assign(conn.logger, {
        info(...args) {
            console.log(
                chalk.bold.rgb(57, 183, 16)(`INFO [${chalk.white(new Date().toISOString())}]:`),
                chalk.cyan(util.format(...args))
            );
        }, 
        error(...args) {
            console.log(
                chalk.bold.rgb(247, 38, 33)(`ERROR [${chalk.white(new Date().toISOString())}]:`),
                chalk.red(util.format(...args))
            );
        },
        warn(...args) {
            console.log(
                chalk.bold.rgb(239, 225, 3)(`WARNING [${chalk.white(new Date().toISOString())}]:`),
                chalk.keyword("orange")(util.format(...args))
            );
        },
    });
};
