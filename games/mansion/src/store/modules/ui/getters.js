export default {
    getPopup: state => state.popup,
    getPopupQueue: state => state.popup.queue,

    isHUDVisible: state => state.hud.visible,
    isUIFrameVisible: state => state.uiframe.visible,
    isUIFrameFadingOut: state => state.uiframe.fadeOut,

    isShotVisible: state => state.shot.visible,
    isShotFatal: state => state.shot.shutter,
    isShotZero: state => state.shot.energy === 100,
    isShotCore: state => state.shot.angle < 0.01,
    isShotClose: state => state.shot.distance < 64,
    isShotDouble: state => state.shot.targets === 2,
    isShotTriple: state => state.shot.targets === 3,
    isShotMultiple: state => state.shot.targets > 3,

    getShotScore: state => state.shot.value,

    getAlbumPhotos: state => state.album.photos.filter(p => p.type === state.album.activeType),
    getPhotoTypes: state => {
        const aTypes = new Set(state.album.photos.map(p => p.type));
        return ([...aTypes]).sort();
    },
    getAlbumActiveType: state => state.album.activeType,
    getUIActiveTab: state => state.uiframe.activeTab
};