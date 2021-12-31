const debug = require('debug')
const {
    buildZip,
    exportLevel
} = require('./level-zip')
const os = require('os');
const promFS = require('../../../libs/prom-fs')
const path = require('path')
const log = debug('serv:gs')

class GameService {
    constructor () {
        this._gamePath = process.env.GAME_PATH
        if (this._gamePath.startsWith('~/')) {
            this._gamePath = os.homedir() + this._gamePath.substr(1)
        }
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

    getLevelFileName(name) {
        const sGamePath = this._gamePath
        const sLevelPath = path.resolve(sGamePath, 'assets/levels')
        return path.join(sLevelPath, name + '.json')
    }

    async unpublishLevel(name) {
        log('unpublishing level %s', name)
        // effacer le fichier json
        await promFS.rm(this.getLevelFileName(name))
        await this.deleteUnusedTextures()
    }

    async loadLevel(name) {
        log('loading level %s', name)
        return JSON.parse(await promFS.read(this.getLevelFileName(name)))
    }

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
    async getLevelTextureList (name) {
        const oLevel = await this.loadLevel(name)
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
            const oStat = await promFS.stat(path.join(sLevelPath, s.name))
            const sName = path.basename(s.name, '.json')
            if (path.extname(s.name) === '.json' && !s.dir) {
                const o = {
                    name: sName,
                    date: oStat.dates.modified,
                    preview: null,
                    exported: true,
                    invault: null,
                    textures: await this.getLevelTextureList(sName)
                }
                aOutput.push(o)
            }
        }
        return aOutput
    }
}

module.exports = GameService
