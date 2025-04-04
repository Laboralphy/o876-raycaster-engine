export default {
    getPopup: state => state.popup,
    getPopupQueue: state => state.popup.queue,

    isHUDVisible: state => state.hud.visible,
    isUIFrameVisible: state => state.uiframe.visible,
    isUIFrameFullyVisible: state => state.uiframe.fullyVisible,
    isMainMenuVisible: state => state.mainmenu.phase < state.mainmenu.phases.game,
    isGameOverPromptVisible: state => state.gameoverprompt.visible,
    isEndOfGameVisible: state => state.endofgame.visible,

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

    getMainMenuPhase: state => state.mainmenu.phase,
    isLoadingPageDisplayed: state => state.mainmenu.phase === state.mainmenu.phases.init,
    isMainMenuPageDisplayed: state => state.mainmenu.phase === state.mainmenu.phases.main,
    isControlsPageDisplayed: state => state.mainmenu.phase === state.mainmenu.phases.controls,
    isStoryPageDisplayed: state => state.mainmenu.phase === state.mainmenu.phases.todo,
    isGameRunning: state => state.mainmenu.phase === state.mainmenu.phases.game,

    getNotes: state => state
        .notes
        .filter(n => n.type === state.uiframe.activeNoteTab)
        .sort((a, b) => {
            const ar = a.read ? 1 : 0
            const br = b.read ? 1 : 0
            if (ar !== br) {
                return ar - br
            }
            const ad = a.date
            const bd = b.date
            return bd - ad
        }),
    getNoteActiveTab: state => state.uiframe.activeNoteTab,

    getSettingMouseFactor: state => state.settings.mouseFactor,
    getSettingMusicVolume: state => state.settings.musicVolume,
    getSettingSFXVolume: state => state.settings.sfxVolume
};
