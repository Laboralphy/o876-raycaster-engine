const path = require('path');
const promfs = require('libs/prom-fs');

const RCGDK_SAVE_FILES_PATH = '.';

class VaultFs {

    constructor() {
        this._vaultPath = RCGDK_SAVE_FILES_PATH;
        this._namespace = '/';
    }

    get path() {
        return this._vaultPath;
    }

    set path(value) {
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
        return path.join(this.path, this.namespace, name);
    }

    /**
     * write data in a file
     * @param filename {string}
     * @param contents {string}
     * @return {Promise<unknown>}
     */
    async save(filename, contents) {
        return promfs.write(this.fqn(filename), contents);
    }

    async mkdir(foldername) {
        return promfs.mkdir(this.fqn(foldername));
    }

    async exist(filename) {
        return !!await promfs.stat(this.fqn(filename))
    }

    /**
     * loads a file contents
     * @param filename {string}
     * @return {Promise<Buffer>}
     */
    async load(filename, bBinary = false) {
        return promfs.read(this.fqn(filename), bBinary);
    }

    async loadJSON(filename) {
        const buff = await this.load(filename, false);
        return JSON.parse(buff.toString());
    }

    async saveJSON(filename, data) {
        const content = JSON.stringify(data, null, '  ');
        return this.save(filename, content);
    }

    async stat(filename) {
        return promfs.stat(this.fqn(filename));
    }

    async ls(path) {
        return promfs.ls(this.fqn(path));
    }

    async rm(filename) {
        return promfs.rm(this.fqn(filename));
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
            const sEntry = list[i].name;
            const filename = path.join(foldername, sEntry);
            const st = await this.stat(filename);
            if (st.dir) {
                // rmdir recursively
                const aSubDeleted = await this.rmdir(filename, bRecursive);
                aSubDeleted.forEach(d => aDeleted.push(d));
            } else {
                // rm filename
                await this.rm(filename);
                aDeleted.push(filename);
            }
        }
        await promfs.rmdir(this.fqn(foldername));
        aDeleted.push(foldername);
        return aDeleted;
    }
}

module.exports = VaultFs;
