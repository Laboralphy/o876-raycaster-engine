export default {
    getQuestItems: state => state.player.inventory.questItems,
    getItemData: state => state.data.items,
    getItemTypes: state => state.data.itemTypes,

    getPlayerAttributeHP: state => state.player.attributes.hp,
    getPlayerAttributeHPMax: state => state.player.attributes.hpMax,
    isPlayerDead: state => state.player.attributes.hp <= 0,

    getCameraEnergy: state => state.camera.energy.value,
    getCameraEnergyMax: state => state.camera.energy.maximum,
    getCameraLastShotTime: state => state.camera.lastShotTime,
    getCameraCaptureRadius: state => state.camera.captureRadius,
    getCameraWidth: state => state.camera.width,
    getCameraPower: state => state.camera.power,
    isCameraAimingSupernatural: state => state.camera.sensor.supernatural,
    getCameraSensorLamp: state => state.camera.sensor.lamp,
    getSupernaturalBeacons: state => state.supernatural.beacons
};