export default {
    getQuestItems: state => state.player.inventory.questItems,
    getItemData: state => state.data.items,
    getItemTypes: state => state.data.itemTypes,

    getPlayerAttributeHP: state => state.player.attributes.hp,
    getPlayerAttributeHPMax: state => state.player.attributes.hpMax,

    getPlayerEnergy: state => state.camera.energy.value,
    getPlayerEnergyMax: state => state.camera.energy.maximum,

    getCameraLastShotTime: state => state.camera.lastShotTime,
    getCameraCaptureRadius: state => state.camera.captureRadius
};