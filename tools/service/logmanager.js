const fs = require('fs');
const util = require('util');
const path = require('path');


const appendFile = util.promisify(fs.appendFile);

let LOG_FILE = path.resolve(__dirname, 'logs/log.txt');

/**
 * Sets the log file name and path
 * @param sFile {string}
 */
function setLogFile(sFile) {
    LOG_FILE = sFile;
}

/**
 * simple log manager
 */
async function log(...args) {
    await appendFile(LOG_FILE, args.join(' ') + '\n');
}

module.exports = {
    setLogFile, log
};