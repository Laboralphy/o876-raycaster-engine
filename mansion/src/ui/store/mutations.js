import * as TYPES from './mutation-types';
export default {

    [TYPES.ADD_POPUP_TEXT]: function(state, {text, icon, time}) {
        if (state.popupTexts.every(p => p.text !== text && p.icon !== icon)) {
            state.popupTexts.push({text, icon, time});
        }
    },

    [TYPES.SHIFT_POPUP]: function(state) {
        if (state.popupTexts.length > 0) {
            state.popupTexts.shift();
        }
    }
}