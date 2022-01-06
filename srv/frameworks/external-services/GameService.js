const debug = require('debug')
const {
    buildZip,
    exportLevel
} = require('./level-zip')
const os = require('os');
const promFS = require('../../../libs/prom-fs')
const path = require('path')
const {homeAliasPath} = require('../../../libs/home-alias-path');
const log = debug('serv:gs')

class GameService {
    constructor () {
        this._gamePath = homeAliasPath(process.env.GAME_PATH)
        log('game path : %s', this._gamePath)
    }

    buildZipBundle(name, data) {
        return buildZip(name, data)
    }

    /**
     * Export a level from Map Editor to the Game Project Directory
     * @param name {string} name of the project to be exported
     * @param data {*} data content
     * @returns {Promise}
     */
    publishLevel(name, data) {
        log('publishing level %s', name)
        return exportLevel(name, data, {
            textures: 'assets/textures',
            level: 'assets/levels',
            game: this._gamePath
        })
    }

    /**
     * Renvoie le nom complet d'un fichier à partir d'un nom de niveau
     * @param name {string}
     * @returns {string} nom de fichier complet (avec chemin d'access)
     */
    getPublishedLevelFileName(name) {
        const sGamePath = this._gamePath
        const sLevelPath = path.resolve(sGamePath, 'assets/levels')
        return path.join(sLevelPath, name + '.json')
    }

    /**
     * Efface un niveau de la liste des niveau publié du jeu
     * Efface les textures inutilisées
     * @param name
     * @returns {Promise<void>}
     */
    async unpublishLevel(name) {
        log('unpublishing level %s', name)
        // effacer le fichier json
        await promFS.rm(this.getPublishedLevelFileName(name))
        await this.deleteUnusedTextures()
    }

    /**
     * Chargement des données d'un niveau
     * @param name {string} nom du niveau
     * @returns {Promise<any>}
     */
    async loadPublishedLevel(name) {
        log('loading level %s', name)
        return JSON.parse(await promFS.read(this.getPublishedLevelFileName(name)))
    }

    /**
     * Liste des textures inutilisées (référencée par aucun niveau)
     * @returns {Promise<*>}
     */
    async getUnusedTextureList () {
        const aExtentions = new Set([
            '.png',
            '.jpg'
        ])
        const sGamePath = this._gamePath
        const sTexturePath = path.resolve(sGamePath, 'assets/textures')
        const aLeveledTextureList = (await this.getPublishedLevelList())
            .map(s => s.textures)
            .reduce((prev, curr) => [...prev, ...curr], [])
        const aTextureSet = new Set(aLeveledTextureList)
        return (await promFS
            .ls(sTexturePath))
            .filter(s => !s.dir)
            .map(({ name }) => path.basename(name))
            .filter(t => aExtentions.has(path.extname(t)) && !aTextureSet.has(t))
    }

    /**
     * Efface les textures inutilisée dans le dossier des textures
     * @returns {Promise<void>}
     */
    async deleteUnusedTextures () {
        log('deleting unused textures')
        const sGamePath = this._gamePath
        const sTexturePath = path.resolve(sGamePath, 'assets/textures')
        const aTextureToDelete = await this.getUnusedTextureList()
        const aPromDel = aTextureToDelete
            .map(t => {
                log('deleting %s', t)
                return promFS.rm(path.join(sTexturePath, t))
            })
        await Promise.all(aPromDel)
    }

    /**
     * Liste des image utilisé par le level
     * @param name {string} nom du niveau
     * @returns {Promise<string[]>}
     */
    async getPublishedLevelTextureList (name) {
        const oLevel = await this.loadPublishedLevel(name)
        const aTilesets = oLevel.tilesets.map(ts => ts.src)
        const sFlats = oLevel.level.textures.flats
        const sWalls = oLevel.level.textures.walls
        const sSky = oLevel.level.textures.sky
        const sPreview = oLevel.preview
        return ([
            ...aTilesets,
            sFlats,
            sWalls,
            sSky,
            sPreview
        ])
            .filter(s => !!s)
            .map(s => path.basename(s))
    }

    /**
     * Renvoie le nom de la préview d'un niveau
     * @param name {string}
     * @return {string}
     */
    async getLevelPreviewURL(name) {
        // déterminer le fichier previe du niveau
        const oLevel = await this.loadPublishedLevel(name)
        const sPreview = oLevel.preview
        return '/game/' + sPreview
    }

    async getPublishedLevelDate (name) {
        const oStat = await promFS.stat(this.getPublishedLevelFileName(name))
        if (oStat) {
            return oStat.dates.modified * 1000
        } else {
            log('level not found %s', name)
            return null
        }
    }

    /**
     * List of all published level in the game
     */
    async getPublishedLevelList() {
        // déterminer le dossier ou se trouve les levels
        const sGamePath = this._gamePath
        const sLevelPath = path.resolve(sGamePath, 'assets/levels')
        const aLevelList = await promFS.ls(sLevelPath)
        // pour chaque level il faut la liste des textures
        const aOutput = []
        for (const s of aLevelList) {
            const sName = path.basename(s.name, '.json')
            if (path.extname(s.name) === '.json' && !s.dir) {
                const o = {
                    name: sName,
                    date: await this.getPublishedLevelDate(sName),
                    preview: await this.getLevelPreviewURL(sName),
                    textures: await this.getPublishedLevelTextureList(sName)
                }
                aOutput.push(o)
            }
        }
        return aOutput
    }
}

module.exports = GameService
