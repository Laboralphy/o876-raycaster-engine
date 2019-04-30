import * as MUTATION from './mutation-types';

export default {
    [MUTATION.BLOCKBUILDER_SET_ID]: (state, {value}) => state.models.blockBuilder.id = value,
    [MUTATION.BLOCKBUILDER_SET_REF]: (state, {value}) => state.models.blockBuilder.ref = value,
    [MUTATION.BLOCKBUILDER_SET_PHYS]: (state, {value}) => state.models.blockBuilder.phys = value,
    [MUTATION.BLOCKBUILDER_SET_OFFS]: (state, {value}) => state.models.blockBuilder.offs = value,
    [MUTATION.BLOCKBUILDER_SET_LIGHT]: (state, {value}) => state.models.blockBuilder.light.enabled = value,
    [MUTATION.BLOCKBUILDER_SET_LIGHT_VALUE]: (state, {value}) => state.models.blockBuilder.light.value = value,
    [MUTATION.BLOCKBUILDER_SET_LIGHT_INNER_RADIUS]: (state, {value}) => state.models.blockBuilder.light.inner = value,
    [MUTATION.BLOCKBUILDER_SET_LIGHT_OUTER_RADIUS]: (state, {value}) => state.models.blockBuilder.light.outer = value,
    [MUTATION.BLOCKBUILDER_SET_FACE]: (state, {face, value}) => state.models.blockBuilder.faces[face] = value,
    [MUTATION.BLOCKBUILDER_SET_FACE_NORTH]: (state, {value}) => state.models.blockBuilder.faces.n = value,
    [MUTATION.BLOCKBUILDER_SET_FACE_EAST]: (state, {value}) => state.models.blockBuilder.faces.e = value,
    [MUTATION.BLOCKBUILDER_SET_FACE_WEST]: (state, {value}) => state.models.blockBuilder.faces.w = value,
    [MUTATION.BLOCKBUILDER_SET_FACE_SOUTH]: (state, {value}) => state.models.blockBuilder.faces.s = value,
    [MUTATION.BLOCKBUILDER_SET_FACE_FLOOR]: (state, {value}) => state.models.blockBuilder.faces.f = value,
    [MUTATION.BLOCKBUILDER_SET_FACE_CEILING]: (state, {value}) => state.models.blockBuilder.faces.c = value,

    [MUTATION.ANIMBUILDER_SET_START]: (state, {value}) => state.models.animationBuilder.start = value,
    [MUTATION.ANIMBUILDER_SET_DURATION]: (state, {value}) => state.models.animationBuilder.duration = value,
    [MUTATION.ANIMBUILDER_SET_FRAMES]: (state, {value}) => state.models.animationBuilder.frames = value,
    [MUTATION.ANIMBUILDER_SET_LOOP]: (state, {value}) => state.models.animationBuilder.loop = value,


    [MUTATION.SELECT_REGION]: (state, {x1, y1, x2, y2}) => {
        state.selectedRegion.x1 = x1;
        state.selectedRegion.y1 = y1;
        state.selectedRegion.x2 = x2;
        state.selectedRegion.y2 = y2;
    }
};


