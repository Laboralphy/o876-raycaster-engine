import * as MUTATION from './mutation-types';

export default {
    [MUTATION.BLOCKBUILDER_SET_PHYS]: (state, {value}) => state.models.blockBuilder.phys = value,
    [MUTATION.BLOCKBUILDER_SET_OFFS]: (state, {value}) => state.models.blockBuilder.offs = value,
    [MUTATION.BLOCKBUILDER_SET_ANIM]: (state, {value}) => state.models.blockBuilder.anim.enabled = value,
    [MUTATION.BLOCKBUILDER_SET_ANIM_DURATION]: (state, {value}) => state.models.blockBuilder.anim.duration = value,
    [MUTATION.BLOCKBUILDER_SET_ANIM_FRAMES]: (state, {value}) => state.models.blockBuilder.anim.frames = value,
    [MUTATION.BLOCKBUILDER_SET_ANIM_LOOP]: (state, {value}) => state.models.blockBuilder.anim.loop = value,
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
};


