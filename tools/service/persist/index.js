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
	try {
		const filename = _getFullName(name);
		await mkdirp(filename);
		// get the preview
		const preview = data.preview;
		if (preview) {
			const i = preview.indexOf(',');
			// does not need preview.json any longer
			// await writeFile(path.resolve(filename, 'preview.json'), JSON.stringify(preview));
			await writeFile(path.resolve(filename, 'preview.jpg'), Buffer.from(preview.substr(i + 1), 'base64'));
		}
		await writeFile(path.resolve(filename, 'level.json'), JSON.stringify(data));
		return {status: 'done'};
	} catch (e) {
		return {status: 'error', error: e.message};
	}
}


/**
 * load data from project folder
 * @param name String project name
 */
function load(name) {
	const filename = _getFullName(name);
	return _getFileContentJSON(path.resolve(filename, 'level.json'));
}


async function loadPreview(name) {
	const filename = _getFullName(name);
	if (await _isReadable(filename)) {
		return readFile(path.resolve(filename, 'preview.jpg'));
	} else {
		return '';
	}
}

/**
 * lists all project saved so far
 */
async function ls() {
	const aList = await readDir(VAULT_PATH, {
		withFileTypes: true
	});
	const aOutput = [];
	for (let i = 0, l = aList.length; i < l; ++i) {
		const f = aList[i];
		const s = f.name;
		if (f.isDirectory()) {
			const filename = path.resolve(VAULT_PATH, s, 'level.json');
			try {
				const st = await stat(filename);
				const date = Math.floor(st.mtimeMs / 1000);
				const name = s;
				aOutput.push({
					"name": name,
					"date": date
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
	loadPreview,
	ls,
	rm,
	setVaultPath,
	getVaultPath
};