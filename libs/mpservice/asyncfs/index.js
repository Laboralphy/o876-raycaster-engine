const fs = require('fs');

const readFile = util.promisify(fs.readFile);

module.exports = {
    readFile
};