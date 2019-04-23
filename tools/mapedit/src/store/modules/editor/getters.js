export default {
    // BLOCK BUILDER
    getBlockBuilderPhysicalData: state => state.data.phys,
    getBlockBuilderAnimLoopData: state => state.data.loops,

    getBlockBuilderPhys: state => state.models.blockBuilder.phys,
    getBlockBuilderOffs: state => state.models.blockBuilder.offs,

    getBlockBuilderAnim: state => state.models.blockBuilder.anim.enabled,
    getBlockBuilderAnimFrames: state => state.models.blockBuilder.anim.frames,
    getBlockBuilderAnimDuration: state => state.models.blockBuilder.anim.duration,
    getBlockBuilderAnimLoop: state => state.models.blockBuilder.anim.loop,

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

}


