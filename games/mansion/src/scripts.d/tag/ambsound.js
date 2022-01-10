import { AUDIO_EVENT_AMBIANCE_LOOP } from "../../consts";

/**
 *
 * @param game {Game} instance du jeu
 * @param remove {function} fonction à appeler si l'on souhaite retirer le tag de la map
 * @param x {number} coordonnée x de la cellule ou se trouve le tag
 * @param y {number} coordonnée y de la cellule ou se trouve le tag
 * @param file {string} fichier de son
 * @param distance {number} puissance du son
 */
export function init (game, remove, x, y, file, distance = 192) {
    const params = {
        x,
        y,
        file,
        distance
    }
    game.soundEvent(AUDIO_EVENT_AMBIANCE_LOOP, params)
    remove()
}
