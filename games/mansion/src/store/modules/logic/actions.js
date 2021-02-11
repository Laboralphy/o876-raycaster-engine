import * as ACTIONS from './action-types';
import * as MUTATIONS from './mutation-types';
import DATA from '../../../../assets/data';

export default {
    [ACTIONS.LOAD_ITEMS]: async function({commit}) {
        const items = DATA.ITEMS;
        commit(MUTATIONS.DEFINE_ITEMS, {items});
    }
}
