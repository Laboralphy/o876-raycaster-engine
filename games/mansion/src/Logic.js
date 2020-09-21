import * as MUTATIONS from './store/modules/logic/mutation-types';
import * as ACTIONS from './store/modules/logic/action-types';
import StoreAbstract from "./StoreAbstract";

class Logic extends StoreAbstract {
    constructor(store) {
        super('logic');
        this.store = store;
    }

    /**
     * Fetch item data
     */
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

    /**
     * Adds a quest items into player inventory
     * @param ref {string}
     */
    addQuestItem(ref) {
        this.commit(MUTATIONS.ADD_QUEST_ITEM, {ref});
    }

    /**
     * Removes a quest items from player inventory
     * @param ref {string}
     */
    removeQuestItem(ref) {
        this.commit(MUTATIONS.REMOVE_QUEST_ITEM, {ref});
    }

    /**
     * Tests if player possess a defined quest items
     * @param ref {string}
     */
    hasQuestItem(ref) {
        return this.prop('getQuestItems').indexOf(ref) >= 0;
    }

    damagePlayer(ghost) {
        const nPower = ghost.data.power;
        const nDamage = nPower;
        this.commit(MUTATIONS.MODIFY_PLAYER_HP, {value: -nDamage});
    }

    isPlayerDead() {
        return this.prop('isPlayerDead');
    }

}

export default Logic;