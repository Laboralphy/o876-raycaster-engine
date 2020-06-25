import * as ACTIONS from './action-types';
import * as MUTATIONS from './mutation-types';
import * as CONSTS from '../../../consts';

let TIMEOUT_SHOT = null;

export default {
    [ACTIONS.SHOW_POPUP]: function({commit, getters, dispatch}, {text, icon}) {
        // is this text worth being displayed ?
        const aList = getters.getPopupQueue;
        const oPopup = getters.getPopup;
        const isAlreadyInList = aList.some(p => p.text === text && p.icon === icon);
        const isAlreadyDisplayed = oPopup.visible && oPopup.text === text && oPopup.icon === icon;
        const bWorthIt = !isAlreadyInList && !isAlreadyDisplayed;

        if (bWorthIt) {
            const bEmptyQueue = aList.length === 0;
            const bVisible = oPopup.visible;

            switch ((bEmptyQueue ? 'e' : 'f') + (bVisible ? 'v' : 'h')) {
                case 'ev': // queue empty + current popup visible
                case 'fv': // queue is full + current popup visible
                    // -> just push the popup
                    commit(MUTATIONS.PUSH_POPUP, {text, icon});
                    break;

                case 'eh': // queue empty + current popup hidden
                    // -> timer is down, reactivate it
                    commit(MUTATIONS.PUSH_POPUP, {text, icon});
                    dispatch(ACTIONS.SHOW_NEXT_POPUP);
                    break;

                case 'fh': // queue is full + current popup hidden (maybe transitionning)
                    // -> just push the popup
                    commit(MUTATIONS.PUSH_POPUP, {text, icon});
                    break;

            }
        }
    },

    [ACTIONS.SHOW_NEXT_POPUP]: function({commit, dispatch, getters}) {
        if (getters.getPopupQueue.length > 0) {
            // if popup is already hidden we don't need to wait before shifting content.
            const CSS_TRANSITION_DELAY = getters.getPopup.visible ? CONSTS.DELAY_BETWEEN_POPUPS : 0;
            commit(MUTATIONS.HIDE_POPUP); // hide the previous popup if any
            setTimeout(() => { // show the popup again with new content
                commit(MUTATIONS.SHIFT_POPUP);
                commit(MUTATIONS.SHOW_POPUP);
                setTimeout(() => dispatch(ACTIONS.SHOW_NEXT_POPUP), getters.getPopup.time);
            }, CSS_TRANSITION_DELAY);
        } else {
            // nothing to shift : hide the popup
            commit(MUTATIONS.HIDE_POPUP);
        }
    },

    [ACTIONS.SET_SHOT]: function({commit, dispatch}, payload) {
        if (!!TIMEOUT_SHOT) {
            // Scores are being displayed currently
            clearTimeout(TIMEOUT_SHOT); // cancel previous time out
            TIMEOUT_SHOT = null; // clear time out flag
        }
        commit(MUTATIONS.SET_SHOT, payload); // sets new shot data
        TIMEOUT_SHOT = setTimeout(() => {
            commit(MUTATIONS.CLEAR_SHOT);
            TIMEOUT_SHOT = null;
        }, CONSTS.SHOT_DISPLAY_DURATION);
    },

    [ACTIONS.HIDE_UI_FRAME]: function({commit}) {
        commit(MUTATIONS.SET_UI_FULLY_VISIBLE, {value: false});
        setTimeout(() => {
            commit(MUTATIONS.SET_UI_FRAME_VISIBLE, {value: false});
            commit(MUTATIONS.SET_HUD_VISIBLE, {value: true});
        }, 300);
    },

    [ACTIONS.SHOW_UI_FRAME]: function({commit}) {
        commit(MUTATIONS.SET_HUD_VISIBLE, {value: false});
        commit(MUTATIONS.SET_UI_FRAME_VISIBLE, {value: true});
        setTimeout(() => commit(MUTATIONS.SET_UI_FULLY_VISIBLE, {value: true}), 16);
    }
}
