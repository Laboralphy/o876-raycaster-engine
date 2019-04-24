import * as MUTATION from './mutation-types';
import * as CONSTS from '../../../consts'

export default {
    [MUTATION.ADD_TILE]: (state, {id, type, content}) => {
        const tiles = type === CONSTS.TILE_TYPE_WALL ? state.tiles.walls : state.tiles.flats;
        if (tiles.find(t => t.id === id)) {
            throw new Error('this id is already present in store');
        }
        tiles.push({
            id,
            type,
            content,
            animation: false
        });
    },

    /**
     * Déplacement d'une tile
     * @param state
     * @param idSource
     * @param idTarget
     */
    [MUTATION.MOVE_TILE]: (state, {idSource, idTarget}) => {
        const tiles = CONSTS.TILE_TYPE_WALL ? state.tiles.walls : state.tiles.flats;
        const iSrc = tiles.findIndex(t => t.id === idSource);
        if (iSrc < 0) {
            throw new Error('could not get source tile : ' + idSource);
        }
        const oTile = tiles[iSrc];
        const iTrg = tiles.findIndex(t => t.id === idTarget);
        if (iTrg >= 0) {
            tiles.splice(iSrc, 1);
            tiles.splice(iTrg, 0, oTile);
        } else {
            throw new Error('could not get target tile : ' + idTarget);
        }
    }
}