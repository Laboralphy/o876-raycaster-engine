const path = require('path');
const asyncfs = require('../asyncfs/index');
const fs = require('fs');

const DATA_PATH = 'data';


class ResourceLoader {

	constructor() {
		this._resources = {};
	}

    /**
	 * Chargement d'un JSON
     * @param sDir
     * @param sFile
     * @return {Promise<object>}
     */
    async loadJSON(sDir, sFile) {
        let sJSON = await asyncfs.readFile(path.resolve(DATA_PATH, sDir, sFile + '.json'), {encoding: 'utf-8'});
        return JSON.parse(sJSON.toString());
    }

	/**
	 * chargement synchrone d'un JSON (utilisé pour les fichier de configuration)
	 * @param sDir {string} répertoire de base
	 * @param sFile {string} nom de fichier
	 * @returns {*}
	 */
    loadJSONSync(sDir, sFile) {
        let sJSON = fs.readFileSync(path.resolve(DATA_PATH, sDir, sFile + '.json'), {encoding: 'utf-8'});
        return JSON.parse(sJSON.toString());
    }

	/**
	 * Chargement des données du client
	 * @param sPlayer {string}
	 * @returns {Promise<{}>}
	 */
	async loadClientData(sPlayer) {
		return {
			...await this.loadJSON('vault/' + sPlayer, 'character'),
			...await this.loadJSON('vault/' + sPlayer, 'location'),
			...await this.loadJSON('vault/' + sPlayer, 'password')
		};
	}

	/**
	 * Chargement d'un niveau
	 * @param sLevel {string}
	 * @returns {Promise<Object>}
	 */
	loadLevel(sLevel) {
		return this.loadJSON('levels', sLevel);
	}

	/**
	 * Renvoie le dossier dans lequel sont stocké les ressources d'un certain type
	 * @param type
	 * @returns {string}
	 */
    getResourceFolder(type) {
		let fullType;

		switch (type) {
			case 'b':
				fullType = 'blueprints';
				break;

			case 't':
				fullType = 'tiles';
				break;

			default:
				throw new Error('this resource type is unknown : "' + type + "'");
		}
        return fullType;
    }

	/**
	 * Chargement d'une resource JSON
	 * @param type {string} type de resource (b pour blueprint, t pour tile)
	 * @param id {string} identifiant de la resource (genre p_magbolt)
	 * @returns {Promise<*>}
	 */
    async loadResource(type, id) {
		try {
			type = this.getResourceFolder(type);
			if (!(type in this._resources)) {
				this._resources[type] = {};
			}
			if (!(id in this._resources[type])) {
				this._resources[type][id] = await this.loadJSON(type, id);
			}
			return this._resources[type][id];
		} catch (e) {
			throw new Error('could not load resource (type "' + type + '" - id "' + id + '") - ' + e.toString());
		}
	}

    /**
     * Chargement synchrone d'une resource JSON
	 * La ressource doit déja avoir été indexée en mêmoire sinon erreur
     * @param type {string} type de resource (b pour blueprint, t pour tile)
     * @param id {string} identifiant de la resource (genre p_magbolt)
     * @returns {Promise<*>}
     */
    loadResourceSync(type, id) {
        try {
            type = this.getResourceFolder(type);
            if (!(type in this._resources)) {
                this._resources[type] = {};
            }
            if (!(id in this._resources[type])) {
                this._resources[type][id] = this.loadJSONSync(type, id);
            }
            return this._resources[type][id];
        } catch (e) {
            throw new Error('could not synchronously load resource (type "' + type + '" - id "' + id + '") - ' + e.toString());
        }
    }
}

module.exports = ResourceLoader;