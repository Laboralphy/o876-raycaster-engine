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

    getThingBuilderGhost: state => state.models.thingBuilder.ghost,
    getThingBuilderId: state => state.models.thingBuilder.id,
    getThingBuilderLight: state => state.models.thingBuilder.light,
    getThingBuilderOpacity: state => state.models.thingBuilder.opacity,
    getThingBuilderRef: state => state.models.thingBuilder.ref,
    getThingBuilderScale: state => state.models.thingBuilder.scale,

    /*
        [MUTATION.THINGBUILDER_SET_GHOST]: (state, {value}) => {
        state.models.thingBuilder.ghost = value;
    },

    [MUTATION.THINGBUILDER_SET_ID]: (state, {value}) => {
        state.models.thingBuilder.id = value;
    },

    [MUTATION.THINGBUILDER_SET_LIGHT]: (state, {value}) => {
        state.models.thingBuilder.light = value;
    },

    [MUTATION.THINGBUILDER_SET_OPACITY]: (state, {value}) => {
        state.models.thingBuilder.opacity = value;
    },

    [MUTATION.THINGBUILDER_SET_REF]: (state, {value}) => {
        state.models.thingBuilder.ref = value;
    },

     */

    getBlockBrowserSelected: state => state.models.blockBrowser.selected,

    getSomethingHasChanged: state => state.somethingHasChanged,

    getLevelGridSelectedRegion: state => state.models.levelGrid.selectedRegion,
    isLevelGridRegionSelected: state => !!state.models.levelGrid.selectedRegion && state.models.levelGrid.selectedRegion.x1 >= 0,
    getLevelGridTopMostUndo: state => state.models.levelGrid.undo.length > 0 ? state.models.levelGrid.undo[state.models.levelGrid.undo.length - 1] : [],
    getHighLightedTags: state => state.models.levelGrid.hltags,
    getLevelList: state => state.levelList,
    getLevelName: state => state.levelName,

    getStatusBarText: state => state.statusBar.content
}


