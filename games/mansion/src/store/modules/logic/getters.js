export default {
    getInventoryItems: state => {
        const oItems = {}
        state.player.inventory.forEach(item => {
            if (item in oItems) {
                ++oItems[item]
            } else {
                oItems[item] = 1
            }
        })
        const aItems = []
        for (const item in oItems) {
            aItems.push({ item, count: oItems[item] })
        }
        return aItems
    },
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
