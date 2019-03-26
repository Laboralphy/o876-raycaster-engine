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
    }
}