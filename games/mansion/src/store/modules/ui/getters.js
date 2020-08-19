export default {
    getPopup: state => state.popup,
    getPopupQueue: state => state.popup.queue,

    isHUDVisible: state => state.hud.visible,
    isUIFrameVisible: state => state.uiframe.visible,
    isUIFrameFullyVisible: state => state.uiframe.fullyVisible,

    isShotVisible: state => state.shot.visible,
    isShotFatal: state => state.shot.shutter,
    isShotZero: state => state.shot.energy === 100,
    isShotCore: state => state.shot.angle >= 0.9,
    isShotClose: state => state.shot.distance < 64,
    isShotDouble: state => state.shot.targets === 2,
    isShotTriple: state => state.shot.targets === 3,
    isShotMultiple: state => state.shot.targets > 3,

    getShotScore: state => state.shot.value,

    getUIActiveTab: state => state.uiframe.activeTab,
    getInventoryActiveTab: state => state.uiframe.activeInventoryTab,

    isPhotoDetailsVisible: state => state.photodetails.visible,
    getPhotoDetailsDescription: state => state.photodetails.description.slice(0),
    getPhotoDetailsContent: state => state.photodetails.content,
    getPhotoDetailsValue: state => state.photodetails.value,
    getPhotoDetailsTitle: state => state.photodetails.title
};