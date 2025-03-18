const text = {
    reset: '\x1b[0m', 
    bold: '\x1b[1m', 
    dim: '\x1b[2m', 
    italic: '\x1b[3m', 
    underline: '\x1b[4m', 
    red: '\x1b[31m', 
    green: '\x1b[32m', 
    yellow: '\x1b[33m',
    blue: '\x1b[34m', 
    magenta: '\x1b[35m', 
    cyan: '\x1b[36m', 
    white: '\x1b[37m', 
    gray: '\x1b[90m', 
    bgRed: '\x1b[41m', 
    bgGreen: '\x1b[42m', 
    bgYellow: '\x1b[43m', 
    bgBlue: '\x1b[44m', 
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m', 
    bgWhite: '\x1b[47m', 
};

module.exports = {
    default: text,
    text
}