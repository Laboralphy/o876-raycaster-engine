import * as ACTIONS from './action-types';
import * as MUTATIONS from './mutation-types';

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

                case 'fh': // queue is full + current popup hidden (should not happen)
                    throw new Error('popup action : non-empty popup queue + current popup hidden : should not happen');
            }
        }
    },

    [ACTIONS.SHOW_NEXT_POPUP]: function({commit, dispatch, getters}) {
        if (getters.getPopupQueue.length > 0) {
            // actually there is a popup to shift
            commit(MUTATIONS.SHIFT_POPUP);
            setTimeout(() => dispatch(ACTIONS.SHOW_NEXT_POPUP), getters.getPopup.time);
        } else {
            // nothing to shift : hide the popup
            commit(MUTATIONS.HIDE_POPUP);
        }
    }
}
