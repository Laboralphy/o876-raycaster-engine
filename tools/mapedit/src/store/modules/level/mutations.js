import * as MUTATION from './mutation-types';
import * as CONSTS from '../../../consts'

/**
 * Renvoie une partie du state, celle qui correspond au type de tile spécifié
 * @param type {string} wall, flat ou sprite (voir la constante)
 * @param state {*} state
 * @return {Array} colleciton de tiles
 */
function getTileStructure(type, state) {
    switch (type) {
        case CONSTS.TILE_TYPE_WALL:
            return state.tiles.walls;

        case CONSTS.TILE_TYPE_FLAT:
            return state.tiles.flats;

        case CONSTS.TILE_TYPE_SPRITE:
            return state.tiles.sprites;
    }
}

export default {
    [MUTATION.ADD_TILE]: (state, {id, type, content}) => {
        const tiles = getTileStructure(type, state);
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
        const tiles = getTileStructure(type, state);
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
        const tiles = getTileStructure(type, state);
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
        const tiles = getTileStructure(type, state);
        const oTile = tiles.find(t => t.id === idTile);
        if (oTile) {
            oTile.animation = null;
        } else {
            throw new Error('could not find this tile : #' + idTile);
        }
    },

    [MUTATION.DELETE_TILE]: (state, {type, id}) => {
        const tiles = getTileStructure(type, state);
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
            preview: '',
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
    },

    [MUTATION.SET_BLOCK_PREVIEW]: (state, {id, content}) => {
        state.blocks.find(b => b.id === id).preview = content;
    },

    [MUTATION.DESTROY_BLOCK]: (state, {id}) => {
        const iBlock = state.blocks.findIndex(b => b.id === id);
        if (iBlock >= 0) {
            state.blocks.splice(iBlock, 1);
        }
    },

    [MUTATION.SET_GRID_SIZE]: (state, {size}) => {
        const g = state.grid;
        // la grille est carrée ; determiner combien de row, col il faut ajouter/enlever
        const nPrevSize = g.length;
        const nDiff = nPrevSize - size;
        if (nDiff > 0) {
            // il faut enlever des ligne
            g.splice(size, nDiff);
            g.forEach(row => row.splice(size, nDiff));
        }
        if (nDiff < 0) {
            for (let i = 0; i < size; ++i) {
                let row;
                if (i < g.length) {
                    row = g[i];
                } else {
                    g.push(row = []);
                }
                while (row.length < size) {
                    row.push({
                        block: 0,
                        upperblock: 0,
                        tags: [],
                        mark: {
                            color: 0,
                            shape: 0
                        },
                        modified: false,
                        selected: false,
                        things: []
                    });
                }
            }
        }
    },

    [MUTATION.SET_CELL_BLOCK]: (state, {x, y, value}) => {
        const cell = state.grid[y][x];
        if (cell.block !== value) {
            cell.modified = true;
            cell.block = value;
        }
    },

    [MUTATION.SET_CELL_TAGS]: (state, {x, y, value}) => {
        const cell = state.grid[y][x];
        cell.modified = true;
        cell.tags = value;
    },

    [MUTATION.ADD_CELL_TAG]: (state, {x, y, value}) => {
        const cell = state.grid[y][x];
        if (cell.tags.indexOf(value) < 0) {
            cell.modified = true;
            cell.tags.push(value);
        }
    },

    [MUTATION.REMOVE_CELL_TAG]: (state, {x, y, value}) => {
        const cell = state.grid[y][x];
        const iTag = cell.tags.indexOf(value);
        if (iTag >= 0) {
            cell.modified = true;
            cell.tags.splice(iTag, 1);
        }
    },

    [MUTATION.SET_CELL_MARK]: (state, {x, y, shape, color}) => {
        const cell = state.grid[y][x];
        if (cell.mark.color !== color && color !== null) {
            cell.modified = true;
            cell.mark.color = color;
        }
        if (cell.mark.shape !== shape && shape !== null) {
            cell.modified = true;
            cell.mark.shape = shape;
        }
    },

    [MUTATION.SET_CELL_UPPER_BLOCK]: (state, {x, y, value}) => {
        const cell = state.grid[y][x];
        if (cell.upperblock !== value) {
            cell.modified = true;
            cell.upperblock = value;
        }
    },

    /**
     * Placement d'un thing dan sune cellule
     * @param state
     * @param x
     * @param y
     * @param id
     */
    [MUTATION.SET_CELL_THING]: (state, {x, y, id}) => {
        const cell = state.grid[y][x];
        const oThing = cell.things.find(t => t.x === x && t.y === y);
        if (oThing) {
            if (oThing.id != id) {
                cell.modified = true;
                oThing.id = id;
            }
        } else {
            cell.things.push({x, y, id});
            cell.modified = true;
        }
    },

    /**
     * Chargement d'un nouveau state
     * @param state
     * @param content {*}
     */
    [MUTATION.SET_STATE_CONTENT]: (state, {content}) => {
        for (let sKey in content) {
            state[sKey] = content[sKey];
        }
    },

    /**
     * Création/mise à jour d'un thing
     * @param state
     * @param data {*}
     */
    [MUTATION.DEFINE_THING]: (state, data) => {
        const index = state.things.findIndex(t => t.id === data.id);
        const oThing = {
            id: data.id,
            ref: data.ref,
            scale: data.scale,
            opacity: data.opacity,
            ghost: data.ghost,
            light: data.light
        };
        if (index >= 0) {
            state.things.splice(index, 1, oThing);
        } else {
            state.things.push(oThing);
        }
    },

    /**
     * Destruction d'un thing créé par DEFINE_THING
     * @param state
     * @param id {number} identifiant du thing à détruire
     */
    [MUTATION.DESTROY_THING]: (state, {id}) => {
        const iThing = state.things.findIndex(t => t.id === id);
        if (iThing >= 0) {
            state.things.splice(iThing, 1);
        }
    }
}