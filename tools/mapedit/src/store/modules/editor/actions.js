import * as ACTION from './action-types';
import * as MUTATION from './mutation-types'
import {getLevelList} from "../../../libraries/fetch-helper";

export default {
    [ACTION.LIST_LEVELS]: async function({commit}) {
        const aList = await getLevelList();
        commit(MUTATION.SET_LEVEL_LIST, {list: aList});
    },

    [ACTION.SET_STATUSBAR_TEXT]: function({commit}, {text}) {
        commit(MUTATION.SET_STATUSBAR_TEXT, {text});
    },

    [ACTION.SELECT_REGION]: function({commit}, {x1, y1, x2, y2}) {
        commit(MUTATION.SELECT_REGION, {x1, y1, x2, y2});
    },

    [ACTION.POP_UNDO]: function({commit}) {
        commit(MUTATION.POP_UNDO);
    }
}