export default {
    // BLOCK BUILDER
    getBlockBuilderPhysicalData: state => state.data.phys,
    getBlockBuilderAnimLoopData: state => state.data.loops,

    getBlockBrowserSelected: state => state.models.blockBrowser.selected,
    getThingBrowserSelected: state => state.models.thingBrowser.selected,
    getLevelGridThingSelected: state => state.models.levelGrid.selectedThing,

    getSomethingHasChanged: state => state.somethingHasChanged,

    getLevelGridSelectedRegion: state => state.models.levelGrid.selectedRegion,
    isLevelGridRegionSelected: state => !!state.models.levelGrid.selectedRegion && state.models.levelGrid.selectedRegion.x1 >= 0,
    getLevelGridTopMostUndo: state => state.models.levelGrid.undo.length > 0 ? state.models.levelGrid.undo[state.models.levelGrid.undo.length - 1] : [],
    getHighLightedTags: state => state.models.levelGrid.hltags,
    getLevelList: state => state.levelList,
    getLevelName: state => state.levelName,

    getStatusBarText: state => state.statusBar.content
}


