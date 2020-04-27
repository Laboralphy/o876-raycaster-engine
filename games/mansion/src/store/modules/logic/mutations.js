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

    /**
     * Define all the items available in game
     * @param state
     * @param items
     */
    [TYPES.DEFINE_ITEMS]: function(state, {items}) {
        items.forEach(x => state.data.items.push(x));
    },

    /**
     * Change player HP value
     * @param state
     * @param value
     */
    [TYPES.SET_PLAYER_HP]: function(state, {value}) {
        // value is ranged between 0 and hpMax
        state.player.attributes.hp = Math.min(state.player.attributes.hpMax, Math.max(0, value));
    },

    /**
     * Define maximum player HP value
     * @param state
     * @param value
     */
    [TYPES.SET_PLAYER_MAX_HP]: function(state, {value}) {
        // value won't be below 1
        state.player.attributes.hpMax = Math.max(1, value);
    },

    /**
     * Increase camera charged energy
     * @param state
     */
    [TYPES.INC_ENERGY]: function(state) {
        const e = state.camera.energy;
        e.value = Math.min(e.maximum, e.value + e.rate);
    },

    /**
     * Decrease camera charged energy
     * @param state
     */
    [TYPES.DEC_ENERGY]: function(state) {
        const e = state.camera.energy;
        e.value = Math.max(0, e.value - e.depleteRate);
    },

    /**
     * Deplete charged energy : set energy to 0
     * @param state
     */
    [TYPES.DEPLETE_ENERGY]: function(state) {
        const e = state.camera.energy;
        e.value = 0;
    },

    [TYPES.FLASH_TAG]: function(state, {tag}) {
        const tags = state.camera.flashed.tags;
        if (!tags.includes(tag)) {
            tag.push(tag);
        }
    },

    [TYPES.FLASH_UNTAG]: function(state, {tag}) {
        const tags = state.camera.flashed.tags;
        const n = tags.indexOf(tag);
        if (n >= 0) {
            tag.splice(n, 1);
        }
    }
}