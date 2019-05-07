import * as ACTION from './action-types';
import * as MUTATION from './mutation-types'

export default {
    [ACTION.LIST_LEVELS]: function() {

    },

    [ACTION.SET_STATUSBAR_TEXT]: function({commit}, {text}) {
        commit(MUTATION.SET_STATUSBAR_TEXT, {text});
    },

    [ACTION.SELECT_REGION]: function({commit}, {x1, y1, x2, y2}) {
        commit(MUTATION.SELECT_REGION, {x1, y1, x2, y2});
    }
}