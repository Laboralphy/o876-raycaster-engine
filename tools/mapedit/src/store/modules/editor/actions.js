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

    [ACTION.SELECT_REGION]: function({commit, getters, rootGetters}, {x1, y1, x2, y2}) {
        commit(MUTATION.SELECT_REGION, {x1, y1, x2, y2});
        const sr = getters.getLevelGridSelectedRegion;
        const tags = ['x'];
        for (let y = sr.y1; y < sr.y2; ++y) {
            for (let x = sr.x1; x < sr.x2; ++x) {
                const cell = rootGetters['level/getGrid'][y][x];
                tags.push(...cell.tags);
            }
        }
        commit(MUTATION.SET_HIGHLIGHTED_TAGS, {tags});
    },

    [ACTION.POP_UNDO]: function({commit}) {
        commit(MUTATION.POP_UNDO);
    },

    [ACTION.SET_LEVEL_NAME]: function({commit}, {name}) {
        commit(MUTATION.SET_LEVEL_NAME, {name});
    }
}