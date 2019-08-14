import * as TYPES from './mutation-types';
export default {

    [TYPES.SHOW_POPUP]: function(state, {text, icon}) {
        state.popup.text = text;
        state.popup.icon = icon;
        state.popup.visible = true;
    },

    [TYPES.HIDE_POPUP]: function(state) {
        state.popup.visible = false;
    }
}