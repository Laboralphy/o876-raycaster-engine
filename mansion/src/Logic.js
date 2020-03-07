import * as MUTATIONS from './store/modules/logic/mutation-types';
import * as ACTIONS from './store/modules/logic/action-types';

class Logic {

    constructor(store) {
        this.store = store;
    }

    dispatch(action, payload) {
        this.store.dispatch('logic/' + action, payload);
    }

    commit(mutation, payload) {
        this.store.commit('logic/' + mutation, payload);
    }

    prop(getter) {
        return this.store.getters['logic/' + getter];
    }

    loadData() {
        this.dispatch(ACTIONS.LOAD_ITEMS);
    }

    /**
     * Return data about an item
     * @param ref {string} item reference
     * @return {*}
     */
    getItemData(ref) {
        const items = this.prop('getItemData');
        const item = items.find(x => x.id === ref);
        if (!item) {
            throw new Error('This item could not be found : "' + ref + '"');
        }
        return item;
    }

    addQuestItem(ref) {
        this.commit(MUTATIONS.ADD_QUEST_ITEM, {ref});
    }

    removeQuestItem(ref) {
        this.commit(MUTATIONS.REMOVE_QUEST_ITEM, {ref});
    }

    hasQuestItem(ref) {
        return this.prop('getQuestItems').indexOf(ref) >= 0;
    }
}


export default Logic;