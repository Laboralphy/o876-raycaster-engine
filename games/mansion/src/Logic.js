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
    addInventoryItem(ref) {
        this.commit(MUTATIONS.ADD_INVENTORY_ITEM, {ref});
    }

    /**
     * Removes a quest items from player inventory
     * @param ref {string}
     */
    removeInventoryItem(ref) {
        this.commit(MUTATIONS.REMOVE_INVENTORY_ITEM, {ref});
    }

    /**
     * Tests if player possess a defined quest items
     * @param ref {string}
     */
    hasInventoryItem(ref) {
        return this
            .prop('getInventoryItems')
            .find(({ item }) => ref === item);
    }

    damagePlayer(ghost, nMultiplier = 1) {
        const nPower = ghost.data.power;
        const nDamage = Math.floor(nPower * nMultiplier);
        this.commit(MUTATIONS.MODIFY_PLAYER_HP, {value: -nDamage});
    }

    isPlayerDead() {
        return this.prop('isPlayerDead');
    }

    incScore(value) {
        return this.commit(MUTATIONS.INC_SCORE, {value})
    }
}

export default Logic;
