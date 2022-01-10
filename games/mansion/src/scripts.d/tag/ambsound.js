// init : jouer le son en boucle
// enter : jouer le son une fois
//
// ambsound loop ambiant-loop/fireplace
// ambsound 1

import {AUDIO_EVENT_AMBIANCE_LOOP} from "../../consts";

export function init (game, remove, x, y, file, distance = 192) {
    const params = {
        x,
        y,
        file,
        distance
    }
    game.soundEvent(AUDIO_EVENT_AMBIANCE_LOOP, params)
}
