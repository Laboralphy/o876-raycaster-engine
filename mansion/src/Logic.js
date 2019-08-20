import * as MUTATIONS from './store/modules/logic/mutation-types';

class Logic {

    constructor(store) {
        this.store = store;
    }

    commit(mutation, payload) {
        this.store.commit('logic/' + mutation, payload);
    }

    prop(getter) {
        return this.store.getters['logic/' + getter];
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