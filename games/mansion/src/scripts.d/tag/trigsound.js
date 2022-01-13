import { AUDIO_EVENT_AMBIANCE_TRIGGER } from "../../consts"

/**
 * trigsound soundfile
 * Permet d'activer un son d'ambiance
 */
export function enter (game, remove, x, y, sSoundFile) {
    game.soundEvent(AUDIO_EVENT_AMBIANCE_TRIGGER, {
        file: sSoundFile
    })
    remove()
}
