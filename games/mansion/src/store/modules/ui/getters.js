export default {
    getPopup: state => state.popup,
    getPopupQueue: state => state.popup.queue,

    isVisible: state => state.visible,

    isShotVisible: state => state.shot.visible,
    isShotFatal: state => state.shot.shutter,
    isShotZero: state => state.shot.energy === 100,
    isShotCore: state => state.shot.angle < 0.01,
    isShotClose: state => state.shot.distance < 64,
    isShotDouble: state => state.shot.targets === 2,
    isShotTriple: state => state.shot.targets === 3,
    isShotMultiple: state => state.shot.targets > 3,

    getShotScore: state => state.shot.value
};