export default {
    getInventoryItems: state => state.player.inventory,
    getItemData: state => state.data.items,

    getPlayerAttributeHP: state => state.player.attributes.hp,
    getPlayerAttributeHPMax: state => state.player.attributes.hpMax,
    isPlayerDead: state => state.player.attributes.hp <= 0,

    getStateContent: state => state,

    getInventoryTotalValue: state => state.player.inventory.map(sItemInv => {
        const oItemFound = state.data.items.find(itd => itd.id === sItemInv);
        if (oItemFound) {
            return oItemFound.value || 0;
        } else {
            console.warn('weird : this item is in player inventory but not defined in item data :', sItemInv);
            return 0;
        }
    }).reduce((prev, curr) => prev + curr, 0)
};
