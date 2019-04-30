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

    getSelectedRegion: state => state.selectedRegion
}


