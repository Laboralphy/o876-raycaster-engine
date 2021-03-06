import * as TYPES from './mutation-types';
export default {

    [TYPES.STORE_PHOTO]: function(state, {content, type, value, ref}) {
        const id = state.photoId++;
        if (state.photoTypes.includes(type)) {
            state.photos.push({
                id,
                type,
                content,
                value,
                ref
            });
        }
    },

    [TYPES.SET_ACTIVE_TYPE]: function(state, {value}) {
        if (state.photoTypes.includes(value)) {
            state.activeType = value;
        }
    },

    [TYPES.SET_PHOTO_TYPE]: function(state, {ref, type}) {
        const oPhoto = state.photos.find(p => p.ref === ref);
        if (!oPhoto) {
            // ignore mutation, if photo is not in album
            return;
        }
        if (state.photoTypes.includes(type)) {
            oPhoto.type = type;
        }
    },

    [TYPES.SET_STATE_CONTENT]: function(state, {content}) {
        for (let i in content) {
            state[i] = content[i];
        }
    }
}
