import * as ACTION from './action-types';
import * as MUTATION from './mutation-types';


let TILE_LAST_ID = 0;


export default {

    /**
     * pushes a new tile in the collection
     * @param commit
     * @param content {string}
     */
    [ACTION.LOAD_TILE]: ({commit}, {type, content}) => {
        const id = ++TILE_LAST_ID;
        commit(MUTATION.ADD_TILE, {id, type, content});
    },

    /**
     * reorder tiles : move a tile from its position to another tile's position
     * @param commit
     * @param idSource
     * @param idTarget
     */
    [ACTION.REORDER_TILE]: ({commit}, {idSource, idTarget}) => {
        commit(MUTATION.MOVE_TILE, {idSource, idTarget});
    },

    /**
     * define animation properties
     * @param commit
     * @param start {number} identified of the initial frame
     * @param duration {number} duration of each aniamtion frame (in ms)
     * @param frames {number} number of frames in the animation
     * @param loop {number} type of loop
     */
    [ACTION.SET_TILE_ANIMATION]: ({commit}, {start, duration, frames, loop}) => {
        commit(MUTATION.SET_TILE_ANIMATION, {start, duration, frames, loop});
    },

    [ACTION.CLEAR_TILE_ANIMATION]: ({commit}, {tile}) => {
        commit(MUTATION.CLEAR_TILE_ANIMATION, {tile});
    }
}