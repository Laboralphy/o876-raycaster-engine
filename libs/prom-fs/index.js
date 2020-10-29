const fs = require('fs');
const util = require('util');
const path = require('path');

const mkdir = util.promisify(require('mkdirp'));
const access = util.promisify(fs.access);
const write = util.promisify(fs.writeFile);
const read = util.promisify(fs.readFile);
const ls = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const rm = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);

module.exports = {
    mkdir,
    access,
    write,
    read,
    ls: async function(foldername) {
        const list = await ls(foldername, {
            withFileTypes: true
        });
        return list.map(f => ({
            name: f.name,
            dir: f.isDirectory()
        }));
    },
    stat: async function(filename) {
        const st = await stat(filename);
        const pp = path.parse(filename);
        return {
            name: pp.base,
            dir: st.isDirectory(),
            size: st.size,
            dates: {
                created: Math.floor(st.birthtimeMs / 1000),
                modified: Math.floor(st.mtimeMs / 1000),
                accessed: Math.floor(st.atimeMs / 1000)
            }
        };
    },
    rm,
    rmdir
};
