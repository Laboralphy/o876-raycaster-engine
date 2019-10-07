const fs = require('fs');
const path = require('path');
const JsonBlobz = require('../../json-blobz');
const Vault = require('./Vault');

const TILE_PATH = 'tiles';

const vault = new Vault();
vault.vaultPath = '.';



async function saveLevel(sUser, sLevelName, data) {
	try {
		const jb = new JsonBlobz();
		vault.namespace = sUser;
		const sTilePath = path.join(sLevelName, TILE_PATH);
		await vault.mkdir(sTilePath);
		const oNewData = await jb.deblob(data, async blobs => {
			for (let hash in blobs) {
				const blob = blobs[hash];
				// persist the file "hash" with the content "blob"
				await vault.mkdir(sTilePath);
				await vault.save(path.join(sTilePath, hash), blob);
			}
		});
		await vault.saveJSON(path.join(sLevelName, 'level.json'), oNewData);
		return {status: 'done'};
	} catch (e) {
		return {status: 'error', error: e.message};
	}
}


async function loadLevel(sUser, sLevelName) {
	const jb = new JsonBlobz();
	vault.namespace = sUser;
	const sTilePath = path.join(sLevelName, TILE_PATH);
	const data = await vault.loadJSON(path.join(sLevelName, 'level.json'));
	return jb.reblob(data, async hashes => {
		const blobs = {};
		for (let i = 0, l = hashes.length; i < l; ++i) {
			const hash = hashes[i];
			// load the file "hash" , put the content into "blob"
			blobs[hash] = await vault.load(path.join(sTilePath, hash));
		}
		return blobs;
	});
}


/**
 * lists all project saved so far
 */
async function listLevels(sUser) {
	vault.namespace = sUser;
	const aList = await vault.ls('.', {
		withFileTypes: true
	});
	const aOutput = [];
	for (let i = 0, l = aList.length; i < l; ++i) {
		const f = aList[i];
		const name = f.name;
		if (f.isDirectory()) {
			const filename = path.join(name, 'level.json');
			try {
				const st = await vault.stat(filename);
				const date = Math.floor(st.mtimeMs / 1000);
				aOutput.push({
					"name": name,
					"date": date
				});
			} catch (e) {
				if (e.code === 'ENOENT') {
					// no required file in this directory
					console.warn('vault.ls - this directory contains neither level.json not preview.json : "' + name + '"');
				} else {
					throw e;
				}
			}
		}
	}
	return aOutput;
}


async function removeLevel(sUser, name) {
	vault.namespace = sUser;
	await vault.rmdir(name, true);
	return {status: 'done'};
}

/**
 * sets a new value for the VAULT_PATH variable, the folder location where all files are stored
 * @param sPath {string} new vault path value
 */
function setVaultPath(sPath) {
	vault.vaultPath = sPath;
}

/**
 * returns the vault path value
 * @return {string}
 */
function getVaultPath() {
	return vault.vaultPath;
}


async function getLevelPreview(sUser, sLevelName) {
	vault.namespace = sUser;
	const data = await vault.loadJSON(path.join(sLevelName, 'level.json'));
	return vault._fqn(path.join(sLevelName, TILE_PATH, data.preview));
}


module.exports = {
	saveLevel,
	loadLevel,
	listLevels,
	removeLevel,
	setVaultPath,
	getVaultPath,
	getLevelPreview
};