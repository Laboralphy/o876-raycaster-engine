import * as MUTATION from './mutation-types';

export default {
    [MUTATION.ADD_TILE]: (state, {id, type, content}) => {
        if (state.tiles.find(t => t.id === id)) {
            throw new Error('this id is already present in store');
        }
        state.tiles.push({id, type, content});
    }
}