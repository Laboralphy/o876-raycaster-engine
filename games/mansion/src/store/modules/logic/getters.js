export default {
    getInventoryItems: state => state.player.inventory,
    getItemData: state => state.data.items,
    getItemTypes: state => state.data.itemTypes,

    getPlayerAttributeHP: state => state.player.attributes.hp,
    getPlayerAttributeHPMax: state => state.player.attributes.hpMax,
    isPlayerDead: state => state.player.attributes.hp <= 0,

    getStateContent: state => state
};