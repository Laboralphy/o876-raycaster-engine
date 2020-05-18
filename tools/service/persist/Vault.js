const fs = require('fs');
const util = require('util');
const path = require('path');
const mkdirp = util.promisify(require('mkdirp'));
let VAULT_PATH = '.';


const access = util.promisify(fs.access);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);

class Vault {

    constructor() {
        this._vaultPath = VAULT_PATH;
        this._namespace = '/';
    }


    get vaultPath() {
        return this._vaultPath;
    }

    set vaultPath(value) {
        console.log('set vault path:', value)
        this._vaultPath = value;
    }

    get namespace() {
        if (Array.isArray(this._namespace)) {
            return path.join(...this._namespace);
        } else {
            return this._namespace;
        }
    }

    set namespace(value) {
        this._namespace = value;
    }

    /**
     * compute the fully qualified name of the resource
     * @param name {string} resource name
     * @return {string} fully qualified resource name
     */
    fqn(name) {
        if (!name) {
            throw new Error('the given resource name is empty');
        }
        if (!this.namespace) {
            throw new Error('the given resource namespace is empty');
        }
        console.log('fqn', path.join(this.vaultPath, this.namespace, name))
        return path.join(this.vaultPath, this.namespace, name);
    }

    /**
     * write data in a file
     * @param filename {string}
     * @param contents {string}
     * @return {Promise<unknown>}
     */
    async save(filename, contents) {
        return writeFile(this.fqn(filename), contents);
    }

    async mkdir(foldername) {
        return mkdirp(this.fqn(foldername));
    }

    /**
     * loads a file contents
     * @param filename {string}
     * @return {Promise<Buffer>}
     */
    async load(filename) {
        return readFile(this.fqn(filename));
    }

    async loadJSON(filename) {
        const buff = await this.load(filename);
        return JSON.parse(buff.toString());
    }

    async saveJSON(filename, data) {
        const content = JSON.stringify(data, null, '  ');
        return this.save(filename, content);
    }

    async stat(filename) {
        return stat(this.fqn(filename));
    }

    async ls(path, options) {
        return readDir(this.fqn(path), options);
    }

    async rm(filename) {
        return unlink(this.fqn(filename));
    }

    /**
     * Recursive RMDIR
     * @param foldername {string}
     * @param bRecursive {boolean}
     * @returns {Promise<array>}
     */
    async rmdir(foldername, bRecursive = false) {
        const list = await this.ls(foldername);
        if (list.length > 0 && !bRecursive) {
            throw new Error('could not remove non-empty directory "' + foldername + '"');
        }
        const aDeleted = [];
        for (let i = 0, l = list.length; i < l; ++i) {
            const sEntry = list[i];
            const filename = path.join(foldername, sEntry);
            const st = await this.stat(filename);
            if (st.isDirectory()) {
                // rmdir recursively
                const aSubDeleted = await this.rmdir(filename, bRecursive);
                aSubDeleted.forEach(d => aDeleted.push(d));
            } else {
                // rm filename
                await this.rm(filename);
                aDeleted.push(filename);
            }
        }
        await rmdir(this.fqn(foldername));
        aDeleted.push(foldername);
        return aDeleted;
    }
}

module.exports = Vault;