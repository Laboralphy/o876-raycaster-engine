import * as TYPES from './mutation-types';
export default {

    [TYPES.STORE_PHOTO]: function(state, {content, type, value, ref}) {
        const id = state.photoId++;
        state.photos.push({
            id,
            type,
            content,
            value,
            ref
        });
    },

    [TYPES.SET_ACTIVE_TYPE]: function(state, {value}) {
        state.activeType = value;
    }
}