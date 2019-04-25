import * as MUTATION from './mutation-types';
import * as CONSTS from '../../../consts'

export default {
    [MUTATION.ADD_TILE]: (state, {id, type, content}) => {
        const tiles = type === CONSTS.TILE_TYPE_WALL ? state.tiles.walls : state.tiles.flats;
        if (tiles.find(t => t.id === id)) {
            throw new Error('this id is already present in store');
        }
        if (isNaN(id)) {
            throw new Error('could not add tile, because id was NaN : "' + id + "'");
        }
        tiles.push({
            id,
            type,
            content,
            animation: null
        });
    },

    /**
     * Déplacement d'une tile
     * @param state
     * @param idSource
     * @param idTarget
     */
    [MUTATION.MOVE_TILE]: (state, {type, idSource, idTarget}) => {
        const tiles = type === CONSTS.TILE_TYPE_WALL ? state.tiles.walls : state.tiles.flats;
        const iSrc = tiles.findIndex(t => t.id === idSource);
        if (iSrc < 0) {
            throw new Error('could not get source tile : ' + idSource);
        }
        const oTile = tiles[iSrc];
        const iTrg = tiles.findIndex(t => t.id === idTarget);
        if (iTrg >= 0) {
            tiles.splice(iSrc, 1);
            tiles.splice(iTrg, 0, oTile);
        } else {
            throw new Error('could not get target tile : ' + idTarget);
        }
    },

    [MUTATION.SET_TILE_ANIMATION]: (state, {type, start, duration, frames, loop}) => {
        const tiles = type === CONSTS.TILE_TYPE_WALL ? state.tiles.walls : state.tiles.flats;
        const oTile = tiles.find(t => t.id === start);
        if (oTile) {
            oTile.animation = {
                duration, frames, loop
            };
        } else {
            throw new Error('could not find this tile : #' + start);
        }
    },

    [MUTATION.CLEAR_TILE_ANIMATION]: (state, {type, idTile}) => {
        const tiles = type === CONSTS.TILE_TYPE_WALL ? state.tiles.walls : state.tiles.flats;
        const oTile = tiles.find(t => t.id === idTile);
        if (oTile) {
            oTile.animation = null;
        } else {
            throw new Error('could not find this tile : #' + idTile);
        }
    },

    [MUTATION.DELETE_TILE]: (state, {type, id}) => {
        const tiles = type === CONSTS.TILE_TYPE_WALL ? state.tiles.walls : state.tiles.flats;
        const tileIndex = tiles.findIndex(t => t.id === id);
        if (tileIndex >= 0) {
            tiles.splice(tileIndex, 1);
        }
    },


    [MUTATION.DEFINE_BLOCK]: (state, data) => {
        const index = state.blocks.findIndex(b => b.id === data.id);
        const oBlock = {
            id: data.id,
            ref: data.ref,
            phys: data.phys,
            offs: data.offs,
            light: {
                enabled: data.light.enabled,
                value: data.light.value,
                inner: data.light.inner,
                outer: data.light.outer
            },
            faces: {
                n: data.faces.n,
                e: data.faces.e,
                w: data.faces.w,
                s: data.faces.s,
                f: data.faces.f,
                c: data.faces.c,
            }
        };
        if (index >= 0) {
            state.blocks.splice(index, 1, oBlock);
        } else {
            state.blocks.push(oBlock);
        }
    }
}