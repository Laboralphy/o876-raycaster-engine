const fs = require('fs');
const util = require('util');

const mkdir = util.promisify(require('mkdirp'));
const access = util.promisify(fs.access);
const write = util.promisify(fs.writeFile);
const read = util.promisify(fs.readFile);
const ls = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const rm = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);

module.exports = {
    mkdir, access, write, read, ls, stat, rm, rmdir
};