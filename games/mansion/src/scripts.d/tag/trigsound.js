import { AUDIO_EVENT_AMBIANCE_TRIGGER } from "../../consts"

/**
 * trigsound (once|<n>s) soundfile
 * Permet d'activer un son.
 * trigsound once <soundfile>
 * -> emet un son d'ambiance une seule fois.
 * trigsound 60 <soundfile>
 * -> emet un son d'ambiance retriggable au plus une fois par minute.
 */
export function enter (game, remove, x, y, sTime, sSoundFile) {
    game.soundEvent(AUDIO_EVENT_AMBIANCE_TRIGGER, params)
}
