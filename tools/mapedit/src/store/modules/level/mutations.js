import * as MUTATION from './mutation-types';

export default {
    [MUTATION.ADD_TILE]: (state, {id, type, content}) => {
        if (state.tiles.find(t => t.id === id)) {
            throw new Error('this id is already present in store');
        }
        state.tiles.push({id, type, content});
    },

    /**
     * Déplacement d'une tile
     * @param state
     * @param idSource
     * @param idTarget
     */
    [MUTATION.MOVE_TILE]: (state, {idSource, idTarget}) => {
        const iSrc = state.tiles.findIndex(t => t.id === idSource);
        if (iSrc < 0) {
            throw new Error('could not get source tile : ' + idSource);
        }
        const oTile = state.tiles[iSrc];
        const iTrg = state.tiles.findIndex(t => t.id === idTarget);
        if (iTrg >= 0) {
            state.tiles.splice(iSrc, 1);
            state.tiles.splice(iTrg, 0, oTile);
        } else {
            throw new Error('could not get target tile : ' + idTarget);
        }
    }
}