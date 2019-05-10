export default {
    // BLOCK BUILDER
    getBlockBuilderPhysicalData: state => state.data.phys,
    getBlockBuilderAnimLoopData: state => state.data.loops,

    getBlockBuilderId: state => state.models.blockBuilder.id,
    getBlockBuilderRef: state => state.models.blockBuilder.ref,
    getBlockBuilderPhys: state => state.models.blockBuilder.phys,
    getBlockBuilderOffs: state => state.models.blockBuilder.offs,
    getBlockBuilderLight: state => state.models.blockBuilder.light.enabled,
    getBlockBuilderLightValue: state => state.models.blockBuilder.light.value,
    getBlockBuilderLightInnerRadius: state => state.models.blockBuilder.light.inner,
    getBlockBuilderLightOuterRadius: state => state.models.blockBuilder.light.outer,
    getBlockBuilderFaceNorth: state => state.models.blockBuilder.faces.n,
    getBlockBuilderFaceEast: state => state.models.blockBuilder.faces.e,
    getBlockBuilderFaceWest: state => state.models.blockBuilder.faces.w,
    getBlockBuilderFaceSouth: state => state.models.blockBuilder.faces.s,
    getBlockBuilderFaceFloor: state => state.models.blockBuilder.faces.f,
    getBlockBuilderFaceCeiling: state => state.models.blockBuilder.faces.c,

    getAnimBuilderStart: state => state.models.animationBuilder.start,
    getAnimBuilderFrames: state => state.models.animationBuilder.frames,
    getAnimBuilderDuration: state => state.models.animationBuilder.duration,
    getAnimBuilderLoop: state => state.models.animationBuilder.loop,

    getBlockBrowserSelected: state => state.models.blockBrowser.selected,

    getLevelGridSelectedRegion: state => state.models.levelGrid.selectedRegion,
    getLevelGridTopMostUndo: state => state.models.levelGrid.undo.length > 0 ? state.models.levelGrid.undo[state.models.levelGrid.undo.length - 1] : [],
    getHighLightedTags: state => state.models.levelGrid.hltags,
    getLevelList: state => state.levelList,
    getLevelName: state => state.levelName,

    getStatusBarText: state => state.statusBar.content
}


