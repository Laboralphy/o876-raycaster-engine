import * as TYPES from './mutation-types';
export default {
    /**
     * Adds a quest item to the player inventory
     * @param state
     * @param ref {string} reference of the quest item
     */
    [TYPES.ADD_QUEST_ITEM]: function(state, {ref}) {
        const qi = state.player.inventory.questItems;
        if (!qi.includes(ref)) {
            qi.push(ref);
        }
    },

    /**
     * Removes a quest item from the player inventory
     * @param state
     * @param ref {string} reference of the quest item
     */
    [TYPES.REMOVE_QUEST_ITEM]: function(state, {ref}) {
        const qi = state.player.inventory.questItems;
        const n = qi.indexOf(ref);
        if (n >= 0) {
            qi.splice(n, 1);
        }
    },

    [TYPES.DEFINE_ITEMS]: function(state, {items}) {
        items.forEach(x => state.data.items.push(x));
    },

    [TYPES.SET_PLAYER_HP]: function(state, {value}) {
        // value is ranged between 0 and hpMax
        state.player.attributes.hp = Math.min(state.player.attributes.hpMax, Math.max(0, value));
    },

    [TYPES.SET_PLAYER_MAX_HP]: function(state, {value}) {
        // value won't be below 1
        state.player.attributes.hpMax = Math.max(1, value);
    }
}