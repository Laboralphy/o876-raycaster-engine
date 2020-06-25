import * as ACTIONS from './action-types';
import * as MUTATIONS from './mutation-types';
import {fetchJSON} from "libs/fetch-json";

export default {
    [ACTIONS.LOAD_ITEMS]: async function({commit}) {
        const items = await fetchJSON('assets/data/items.json');
        commit(MUTATIONS.DEFINE_ITEMS, {items});
    }
}
