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


/**
 * returns the full name of a file, by prepending the root directory
 * @param name {string} name of resource
 * @return {string}
 */
function _getFullName(name) {
    if (!name) {
        throw new Error('the given resource name is empty');
    }
    return path.resolve(VAULT_PATH, name);
}


async function _getFileContentJSON(name) {
	const buff = await readFile(name);
	return JSON.parse(buff.toString());
}

async function _isFolder(name) {
	try {
		const st = await stat(name);
		return st.isDirectory();
	} catch (e) {
		return false;
	}
}

/**
 * tests if file is writable
 * @param name
 * @returns {Promise<boolean>}
 * @private
 */
async function _isReadable(name) {
	try {
		await access(name, fs.constants.R_OK);
		return true;
	} catch (e) {
		return false;
	}
}


/**
 * tests if file is writable
 * @param name
 * @returns {Promise<boolean>}
 * @private
 */
async function _isWritable(name) {
	try {
		await access(name, fs.constants.W_OK);
		return true;
	} catch (e) {
		return false;
	}
}

/**
 * save project content into a folder
 * @param name {string} project name
 * @param data {*} project content
 */
async function save(name, data) {
	const filename = _getFullName(name);
	await mkdirp(filename);
	// get the preview
	const preview = data.preview;
	if (preview) {
		await writeFile(path.resolve(filename, 'preview.json'), JSON.stringify(preview));
	}
	await writeFile(path.resolve(filename, 'level.json'), JSON.stringify(data));
	return {status: 'done'};
}


/**
 * load data from project folder
 * @param $name String project name
 */
async function load($name) {
	const filename = _getFullName($name);
	return await _getFileContentJSON(path.resolve(filename, 'level.json'));
}


/**
 * lists all project saved so far
 */
async function ls() {
	const aList = await readDir(VAULT_PATH);
	const aOutput = [];
	for (let i = 0, l = aList.length; i < l; ++i) {
		const s = aList[i];
		const dirname = path.resolve(VAULT_PATH, s);
		if (await _isFolder(dirname)) {
			const filename = path.resolve(VAULT_PATH, s, 'level.json');
			const previewFilename = path.resolve(VAULT_PATH, s, 'preview.json');
			try {
				const st = await stat(filename);
				const date = Math.floor(st.mtimeMs / 1000);
				const name = s;
				let preview = false;
				if (await _isReadable(previewFilename)) {
					preview = await _getFileContentJSON(previewFilename);
				}
				aOutput.push({
					"name": name,
					"date": date,
					"preview": preview
				});
			} catch (e) {
				if (e.code === 'ENOENT') {
					// no required file in this directory
					console.warn('persist.ls - this directory contains neither level.json not preview.json : "' + s + '"');
				} else {
					throw e;
				}
			}
		}
	}
	return aOutput;
}

/**
 * Recursive RMDIR
 * @param dir
 * @returns {Promise<void>}
 * @private
 */
async function _rmdir_r(dir) {
	const list = await readDir(dir);
	for(let i = 0, l = list.length; i < l; ++i) {
		const filename = path.join(dir, list[i]);
		const st = await stat(filename);

		if(st.isDirectory()) {
			// rmdir recursively
			await _rmdir_r(filename);
		} else {
			// rm fiilename
			await unlink(filename);
		}
	}
	await rmdir(dir);
}


async function rm(name) {
	await _rmdir_r(path.resolve(VAULT_PATH, name));
	return {status: 'done'};
}

/**
 * sets a new value for the VAULT_PATH variable, the folder location where all files are stored
 * @param sPath {string} new vault path value
 */
function setVaultPath(sPath) {
	VAULT_PATH = sPath;
}

/**
 * returns the vault path value
 * @return {string}
 */
function getVaultPath() {
	return VAULT_PATH;
}



module.exports = {
	save,
	load,
	ls,
	rm,
	setVaultPath,
	getVaultPath
};