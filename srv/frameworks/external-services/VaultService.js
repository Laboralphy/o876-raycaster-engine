const path = require('path');
const JsonBlobz = require('../../../libs/json-blobz');
const VaultFS = require('./vault-fs/vault-fs');

const TILE_PATH = 'tiles';

class VaultService {
	constructor () {
		this.VAULT_DEFAULT_PATH = '.'
	}

	getUserVault(sUser) {
		const v = new VaultFS();
		v.path = this.VAULT_DEFAULT_PATH;
		v.namespace = path.join(sUser, 'maps');
		return v;
	}

	async saveLevel(sUser, sLevelName, data) {
		try {
			const vault = this.getUserVault(sUser);
			const jb = new JsonBlobz();
			const sLevelPath = sLevelName;
			const sTilePath = path.join(sLevelPath, TILE_PATH);
			await vault.mkdir(sTilePath);
			const oNewData = await jb.deblob(data, async blobs => {
				for (let hash in blobs) {
					const blob = blobs[hash];
					// vault-fs the file "hash" with the content "blob"
					await vault.save(path.join(sTilePath, hash), blob);
				}
			});
			await vault.saveJSON(path.join(sLevelPath, 'level.json'), oNewData);
			return {status: 'done'};
		} catch (e) {
			console.error(e)
			return {status: 'error', error: e.message};
		}
	}

	async loadLevel(sUser, sLevelName) {
		const vault = this.getUserVault(sUser);
		const jb = new JsonBlobz();
		const sLevelPath = sLevelName;
		const sTilePath = path.join(sLevelPath, TILE_PATH);
		const data = await vault.loadJSON(path.join(sLevelPath, 'level.json'));
		return jb.reblob(data, async hashes => {
			const blobs = {};
			for (let i = 0, l = hashes.length; i < l; ++i) {
				const hash = hashes[i];
				// load the file "hash" , put the content into "blob"
				blobs[hash] = await vault.load(path.join(sTilePath, hash), true);
			}
			return blobs;
		});
	}

	async listLevels(sUser) {
		const vault = this.getUserVault(sUser);
		const aList = await vault.ls('.');
		const aOutput = [];
		for (let i = 0, l = aList.length; i < l; ++i) {
			const f = aList[i];
			const name = f.name;
			if (f.dir) {
				const filename = path.join(name, 'level.json');
				try {
					const st = await vault.stat(filename);
					aOutput.push({
						"name": name,
						"date": st.dates.modified,
						"preview": '/vault/' + name + '.jpg'
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

	async removeLevel(sUser, name) {
		const vault = this.getUserVault(sUser);
		await vault.rmdir(name, true);
		return {status: 'done'};
	}

	/**
	 * sets a new value for the RCGDK_SAVE_FILES_PATH variable, the folder location where all files are stored
	 * @param sPath {string} new vault path value
	 */
	setVaultPath(sPath) {
		this.VAULT_DEFAULT_PATH = sPath;
	}

	/**
	 * returns the vault path value
	 * @return {string}
	 */
	getVaultPath() {
		return this.VAULT_DEFAULT_PATH;
	}

	async getLevelPreview(sUser, sLevelName) {
		const vault = this.getUserVault(sUser);
		const data = await vault.loadJSON(path.join(sLevelName, 'level.json'));
		if (data.preview) {
			return vault.fqn(path.join(sLevelName, TILE_PATH, data.preview));
		} else {
			return ''
		}
	}
}

module.exports = VaultService
