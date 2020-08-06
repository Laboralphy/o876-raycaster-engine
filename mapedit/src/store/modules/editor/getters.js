export default {
    // BLOCK BUILDER
    getBlockBuilderPhysicalData: state => state.data.phys,
    getBlockBuilderAnimLoopData: state => state.data.loops,

    getBlockBrowserSelected: state => state.models.blockBrowser.selected,
    getThingBrowserSelected: state => state.models.thingBrowser.selected,
    getLevelGridThingSelected: state => state.models.levelGrid.selectedThing,
    getTileBrowserType: state => state.models.tileBrowser.type,

    getSomethingHasChanged: state => state.somethingHasChanged,

    getLevelGridSelectedRegion: state => state.models.levelGrid.selectedRegion,
    isLevelGridRegionSelected: state => !!state.models.levelGrid.selectedRegion && state.models.levelGrid.selectedRegion.x1 >= 0,
    getLevelGridTopMostUndo: state => state.models.levelGrid.undo.length > 0 ? state.models.levelGrid.undo[state.models.levelGrid.undo.length - 1] : [],
    getHighLightedTags: state => state.models.levelGrid.hltags,
    getLevelList: state => state.levelList,
    getLevelName: state => state.levelName,

    getStatusBarText: state => state.statusBar.content,
    getLevelGeneratedData: state => state.levelData,

    getPopupVisible: state => state.popup.visible,
    getPopupType: state => state.popup.type,
    getPopupContent: state => state.popup.content,
    getPopupProgress: state => state.popup.progress,

    getSelectedTool: state => state.models.levelGrid.selectedTool,

    getUserAuth: state => state.user.auth,
    getUserName: state => state.user.name
}


