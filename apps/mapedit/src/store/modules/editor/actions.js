import * as ACTION from './action-types';
import * as MUTATION from './mutation-types'
import {getLevelList, getUserData} from "../../../libs/fetch-helper";


function getHighlightedTags(sr, grid) {
    const tags = [];
    for (let y = sr.y1; y <= sr.y2; ++y) {
        for (let x = sr.x1; x <= sr.x2; ++x) {
            if (!grid[y]) {
                return;
            }
            const cell = grid[y][x];
            tags.push(...cell.tags);
        }
    }
    return tags.sort().filter((x, i, a) => a.indexOf(x) === i);
}

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
        const tags = getHighlightedTags(getters.getLevelGridSelectedRegion, rootGetters['level/getGrid']);
        commit(MUTATION.SET_HIGHLIGHTED_TAGS, {tags});
    },

    [ACTION.POP_UNDO]: function({commit}) {
        commit(MUTATION.POP_UNDO);
    },

    [ACTION.SET_LEVEL_NAME]: function({commit}, {name}) {
        commit(MUTATION.SET_LEVEL_NAME, {name});
    },

    [ACTION.SET_SELECTED_TOOL]: function({commit}, {value}) {
        commit(MUTATION.SET_SELECTED_TOOL, {value});
        switch (value) {
            case 0:
                // déselectionner le block en cours
                commit(MUTATION.BLOCKBROWSER_SET_SELECTED, {value: null});
                break;

            case 1:
                // désélectionner la région
                commit(MUTATION.SELECT_REGION, {x1: -1, y1: -1, x2: -1, y2: -1});
                break;
        }
        commit(MUTATION.SOMETHING_HAS_CHANGED, {value: true});
    },

    [ACTION.FETCH_USER_DATA]: async function({commit}) {
        commit(MUTATION.SET_USER, await getUserData());
    }
}