export default {
    getPopup: state => state.popup,
    getPopupQueue: state => state.popup.queue,

    isHUDVisible: state => state.hud.visible,
    isUIFrameVisible: state => state.uiframe.visible,
    isUIFrameFullyVisible: state => state.uiframe.fullyVisible,
    isMainMenuVisible: state => state.mainmenu.phase < state.mainmenu.phases.game,

    isShotVisible: state => state.shot.visible,
    isShotFatal: state => state.shot.targets > 0 && state.shot.shutter,
    isShotZero: state => state.shot.targets > 0 && state.shot.energy === 100,
    isShotCore: state => state.shot.targets > 0 && state.shot.angle >= 0.9,
    isShotClose: state => state.shot.targets > 0 && state.shot.distance < 64,
    isShotDouble: state => state.shot.targets === 2,
    isShotTriple: state => state.shot.targets === 3,
    isShotMultiple: state => state.shot.targets > 3,
    isShotDamaging: state => state.shot.damage > 0,

    getShotScore: state => state.shot.damage > 0 ? state.shot.damage : state.shot.value,

    getUIActiveTab: state => state.uiframe.activeTab,
    getInventoryActiveTab: state => state.uiframe.activeInventoryTab,

    isPhotoDetailsVisible: state => state.photodetails.visible,
    getPhotoDetailsDescription: state => state.photodetails.description.slice(0),
    getPhotoDetailsContent: state => state.photodetails.content,
    getPhotoDetailsValue: state => state.photodetails.value,
    getPhotoDetailsTitle: state => state.photodetails.title,

    getMainMenuPhase: state => state.mainmenu.phase
};