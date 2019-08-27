export default {
    getQuestItems: state => state.player.inventory.questItems,
    getItemData: state => state.data.items,

    getPlayerAttributeHP: state => state.player.attributes.hp,
    getPlayerAttributeHPMax: state => state.player.attributes.hpMax,
};