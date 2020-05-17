const fs = require('fs');

class Config {

	constructor() {
		this._config = {};
	}

	/**
	 * chargement du fichier de config spécifié (Synchrone)
	 * Cette fonction se lance en tout début de programme
	 * Rempli l'ojbet _config
	 * @param sFile
	 */
	load(sFile) {
		let sContent = fs.readFileSync(sFile);
		this._config = JSON.parse(sContent);
	}

	/**
	 * Renvoie l'objet d econfiguration
	 * @returns {{}|*}
	 */
	config() {
		return this._config;
	}
}

const oConfig = new Config();
oConfig.load('config.json');
module.exports = oConfig.config();