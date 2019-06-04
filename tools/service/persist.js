const fs = require('fs');
const util = require('util');
const path = require('path');
const mkdirp = util.promisify(require('mkdirp'))	;
const {log} = require('./logmanager');

const VAULT_DIR = path.resolve(__dirname, 'vault');


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
    return path.resolve(VAULT_DIR, name);
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
	return await readFile(path.resolve(filename, 'level.json'));
}


/**
 * lists all project saved so far
 */
async function ls() {
	const aList = await readDir(VAULT_DIR);
	const aOutput = [];
	for (let i = 0, l = aList.length; i < l; ++i) {
		const s = aList[i];
		const filename = path.resolve(VAULT_DIR, s, 'level.json');
		const previewFilename = path.resolve(VAULT_DIR, s, 'preview.json');
		const st = await stat(filename);
		const date = Math.floor(st.mtimeMs / 1000);
		const name = s;
		let preview = false;
		try {
			await stat(previewFilename);
			const buff = await readFile(previewFilename);
			preview = buff.toString();
			console.log(preview);
		} catch (e) {
			preview = false;
		}
		aOutput.push({
			"name": name,
			"date": date,
			"preview": preview
		});
	}
	return aOutput;
}

async function rm(name) {
	await unlink(path.resolve(VAULT_DIR, name, 'level.json'));
	await unlink(path.resolve(VAULT_DIR, name, 'preview.json'));
	await rmdir(path.resolve(VAULT_DIR, name));
	return {status: 'done'};
}



module.exports = {save, load, ls, rm};