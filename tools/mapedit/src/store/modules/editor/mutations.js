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

    [MUTATION.BLOCKBROWSER_SET_SELECTED]: (state, {value}) => state.models.blockBrowser.selected = value,

    [MUTATION.SOMETHING_HAS_CHANGED]: (state, {value}) => state.somethingHasChanged = value,

    [MUTATION.SELECT_REGION]: (state, {x1, y1, x2, y2}) => {
        state.models.levelGrid.selectedRegion.x1 = Math.min(x1, x2);
        state.models.levelGrid.selectedRegion.y1 = Math.min(y1, y2);
        state.models.levelGrid.selectedRegion.x2 = Math.max(x1, x2);
        state.models.levelGrid.selectedRegion.y2 = Math.max(y1, y2);
    },

    [MUTATION.SET_LEVEL_LIST]: (state, {list}) => {
        state.levelList = list;
    },

    [MUTATION.SET_STATUSBAR_TEXT]: (state, {text}) => {
        state.statusBar.content = text;
    },

    [MUTATION.PUSH_UNDO]: (state, {undo}) => {
        const u = state.models.levelGrid.undo;
        u.push(undo);
        while (u.length > 16) {
            u.shift();
        }
    },

    [MUTATION.POP_UNDO]: state => {
        state.models.levelGrid.undo.pop();
    },

    [MUTATION.SET_LEVEL_NAME]: (state, {name}) => state.levelName = name,

    [MUTATION.SET_HIGHLIGHTED_TAGS]: (state, {tags}) => state.models.levelGrid.hltags = tags,
    [MUTATION.REMOVE_HIGHLIGHTED_TAG]: (state, {tag}) => {
        const tags = state.models.levelGrid.hltags;
        const iTag = tags.indexOf(tag);
        if (iTag >= 0) {
            tags.splice(iTag, 1);
        }
    },
    [MUTATION.ADD_HIGHLIGHTED_TAG]: (state, {tag}) => {
        const tags = state.models.levelGrid.hltags;
        const iTag = tags.indexOf(tag);
        if (iTag < 0) {
            tags.push(tag);
        }
    },

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
}