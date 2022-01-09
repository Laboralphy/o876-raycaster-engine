import { Howl, Howler } from 'howler'
import AUDIO from '../assets/data/audio.json'

class AudioManager {
    constructor () {
        this.audioPath = 'assets/audio'
        this.streamedSounds = new Set([
            'ambiance',
            'apparitions',
            'events',
            'music'
        ])
        this._bgm = null
        this._registry = {}
        this.BGM_VOLUME = 0.5
    }

    buildFileLoadingArray (sFile) {
        return [
            this.audioPath + '/mp3/' + sFile + '.mp3',
            this.audioPath + '/ogg/' + sFile + '.ogg',
        ]
    }

    load (sFile, options) {
        return new Promise((resolve, reject) => {
            try {
                const aFile = sFile.split('/')
                const id = aFile.pop()
                const sound = new Howl({
                    src: this.buildFileLoadingArray(sFile),
                    ...options
                })
                const oSound = {
                    id,
                    filename: sFile,
                    sound
                }
                if (options.autoplay) {
                    resolve(oSound)
                } else {
                    sound.on('load', () => {
                        resolve(oSound)
                    })
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    loadSoundCategory (aFiles, options) {
        return aFiles.map(f => this.load(f, options))
    }

    setListeningEntity (position) {
        Howler.pos(position.x, position.y, position.z)
        const angle = position.angle
        const x = Math.cos(angle);
        const y = 0;
        const z = Math.sin(angle);
        Howler.orientation(x, y, z, 0, 1, 0)
    }

    stopBGM () {
        if (this._bgm) {
            this._bgm.sound.fade(1, 0, 2000, undefined)
            this._bgm = null
        }
    }

    async playBGM (sFile) {
        console.log('[a] received new play bgm order : %s', sFile)
        if (this._bgm === null) {
            if (!!sFile) {
                console.log('[a] creating new bgm object')
                this._bgm = await this.load(sFile, {
                    html5: true,
                    loop: true,
                    autoplay: true,
                    volume: this.BGM_VOLUME
                })
            }
        } else {
            if (this._bgm.filename === sFile && !this._bgm.next) {
                return
            }
            // fadeout le BGM actuel
            if (this._bgm.next) {
                console.log('[a] already queued %s : changing to %s', this._bgm.next, sFile)
                this._bgm.next = sFile
                return
            }
            this._bgm.next = sFile
            console.log('[a] fading out current bgm')
            this._bgm.sound.fade(this.BGM_VOLUME, 0, 2000, undefined)
            this._bgm.sound.once('fade', () => {
                console.log('[a] fade out complete')
                const sNewBGM = this._bgm.next
                this._bgm = null
                if (sNewBGM) {
                    return this.playBGM(sNewBGM)
                }
            })
        }
    }

    /**
     * Joue un son d'ambiance. Ce genre de son n'a pas besoin d'être chargé au debut du prorgamme.
     * Même si le son est joué avec une fraction de seconde en retard ce n'est pas grave.
     * @param sFile {string}
     */
    async playAmbiance (sFile) {
        const { sound } = await this.load(sFile, {
            autoplay: true
        })
        sound.on('end', () => {
            sound.unload()
        })
    }

    /**
     * Joue un son stocké en mémoire
     * Ne fonctionne que pour les sons communs et courts comme les bruitages ou autres effets sonores de jeu
     * @param sId
     * @returns {*}
     */
    play (sId) {
        if (sId in this._registry) {
            const { sound } = this._registry[sId]
            return {
                id: sound.play(),
                sound
            }
        } else {
            console.error('[a] this sound is not registered : %s', sId)
        }
    }

    async init () {
        // les sons les plus utilisés
        const aMechanisms = this.loadSoundCategory(
            AUDIO.files.filter(f => f.startsWith('mechanisms/')),
            {
                preload: true
            }
        )
        const aPickup = this.loadSoundCategory(
            AUDIO.files.filter(f => f.startsWith('pickup/')),
            {
                preload: true
            }
        )
        const aMagic = this.loadSoundCategory(
            AUDIO.files.filter(f => f.startsWith('magic/')),
            {
                preload: true
            }
        )
        const aGhosts = this.loadSoundCategory(
            AUDIO.files.filter(f => f.startsWith('ghosts/')),
            {
                preload: true
            }
        )
        const aSounds = await Promise.all([
            ...aMagic,
            ...aMechanisms,
            ...aPickup,
            ...aGhosts
        ])

        aSounds.forEach(s => {
            this._registry[s.id] = s
        })
        console.log('[a] %d sound(s) has been loaded', Object.keys(this._registry).length)
    }
}

export default AudioManager
