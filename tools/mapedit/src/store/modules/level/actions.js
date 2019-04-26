import * as ACTION from './action-types';
import * as MUTATION from './mutation-types';
import {render} from '../../../libraries/block-renderer';

export default {

    /**
     * pushes a new tile in the collection
     * @param commit
     * @param content {string}
     */
    [ACTION.LOAD_TILE]: ({commit, getters, state}, {type, content}) => {
        commit(MUTATION.ADD_TILE, {id: getters.getMaxTileId + 1, type, content});
    },

    /**
     * pushes a new tile in the collection
     * @param commit
     * @param content {string}
     */
    [ACTION.LOAD_TILES]: ({commit, getters, state}, {type, contents}) => {
        let id = getters.getMaxTileId + 1;
        for (let i = 0, l = contents.length; i < l; ++i) {
            commit(MUTATION.ADD_TILE, {id: id + i, type, content: contents[i]});
        }
    },

    /**
     * reorder tiles : move a tile from its position to another tile's position
     * @param commit
     * @param idSource
     * @param idTarget
     */
    [ACTION.REORDER_TILE]: ({commit, getters}, {idSource, idTarget}) => {
        const tileSource = getters.getTile(idSource);
        commit(MUTATION.MOVE_TILE, {type: tileSource.type, idSource, idTarget});
    },

    /**
     * define animation properties
     * @param commit
     * @param start {number} identified of the initial frame
     * @param duration {number} duration of each aniamtion frame (in ms)
     * @param frames {number} number of frames in the animation
     * @param loop {number} type of loop
     */
    [ACTION.SET_TILE_ANIMATION]: ({commit, getters}, {start, duration, frames, loop}) => {
        const tile = getters.getTile(start);
        commit(MUTATION.SET_TILE_ANIMATION, {type: tile.type, start, duration, frames, loop});
    },

    /**
     * Supprime les donnée d'animation associée à une tile initiale
     * @param commit
     * @param getters
     * @param idTile {number} identifiant de la tile
     */
    [ACTION.CLEAR_TILE_ANIMATION]: ({commit, getters}, {idTile}) => {
        const tile = getters.getTile(idTile);
        commit(MUTATION.CLEAR_TILE_ANIMATION, {type: tile.type, tile});
    },

    /**
     * suppression de la tile spécifiée
     * @param commit
     * @param getters
     * @param id {number} identifiant de la tile qu'on veut supprimer
     */
    [ACTION.DELETE_TILE]: ({commit, getters}, {id}) => {
        const tile = getters.getTile(id);
        if (!tile) {
            throw new Error('could not find this tile : ' + id);
        }
        commit(MUTATION.DELETE_TILE, {type: tile.type, id});
    },


    /**
     * creation d'un block
     */
    [ACTION.CREATE_BLOCK]: ({commit, getters}, data) => {
        const oBlock = {
            id: getters.getMaxBlockId + 1,
            ...data
        };
        commit(MUTATION.DEFINE_BLOCK, oBlock);
    },

    [ACTION.MODIFY_BLOCK]: ({commit}, data) => {
        commit(MUTATION.DEFINE_BLOCK, data);
    },

    /**
     * Effacer block
     * @param commit
     * @param id
     */
    [ACTION.DELETE_BLOCK]: ({commit}, {id}) => {
        commit(MUTATION.DESTROY_BLOCK, {id});
    }
}