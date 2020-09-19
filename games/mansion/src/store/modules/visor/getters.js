export default {
    getCameraEnergy: state => state.energy.value,
    getCameraEnergyMax: state => state.energy.maximum,
    getCameraLastShotTime: state => state.lastShotTime,
    getCameraCaptureRadius: state => state.captureRadius,
    getCameraWidth: state => state.width,
    getCameraPower: state => state.power,
    isCameraAimingSupernatural: state => state.sensor.supernatural,
    getCameraSensorLamp: state => state.sensor.lamp
};