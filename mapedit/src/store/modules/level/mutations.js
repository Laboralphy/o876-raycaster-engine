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

function shiftArray(grid, direction) {
    switch (direction) {
        case 'n': {
            const r = grid.shift();
            grid.push(r);
            break;
        }

        case 's': {
            const r = grid.pop();
            grid.unshift(r);
            break;
        }

        case 'e': {
            grid.forEach(row => {
                const cell = row.pop();
                row.unshift(cell);
            });
            break;
        }

        case 'w': {
            grid.forEach(row => {
                const cell = row.shift();
                row.push(cell);
            });
            break;
        }
    }
}

function moveStartpoint(sp, width, height, direction) {
    const xy = {
        n: {x: 0, y: -1},
        e: {x: 1, y: 0},
        w: {x: -1, y: 0},
        s: {x: 0, y: 1},
    };
    const {x, y} = xy[direction];
    if (sp.x >= 0 && sp.y >= 0) {
        sp.x = (sp.x + x + width) % width;
        sp.y = (sp.y + y + height) % height;
    }
}

export default {
    [MUTATION.ADD_TILE]: (state, {id, type, content, width, height}) => {
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
            width,
            height,
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
            throw new Error('an animation references tile type: ' + type + ' - id:' + start + ' - but the tile could not be found in store');
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
        // ne faudrait-il pas remplacer tous les blocks de cet id par 0 ?
        for (let y = 0, h = state.grid.length; y < h; ++y) {
            const row = state.grid[y];
            for (let x = 0, w = row.length; x < w; ++x) {
                const cell = row[x];
                if (cell.block === id) {
                    cell.modified = true;
                    cell.block = 0;
                }
            }
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

    [MUTATION.MODIFY_CELL_TAG]: (state, {x, y, oldValue, newValue}) => {
        const cell = state.grid[y][x];
        const iTag = cell.tags.indexOf(oldValue);
        if (iTag >= 0) {
            cell.modified = true;
            cell.tags[iTag] = newValue;
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
    [MUTATION.SET_CELL_THING]: (state, {x, y, xt, yt, id}) => {
        const cell = state.grid[y][x];
        const iThing = cell.things.findIndex(t => t.x === xt && t.y === yt);
        if (iThing >= 0) {
            const oThing = cell.things[iThing];
            if (oThing.id != id) {
                cell.modified = true;
                oThing.id = id;
            }
        } else {
            cell.things.push({x: xt, y: yt, id});
            cell.things = cell.things.sort((a, b) => {
                const ax = a.x * 10 + a.y;
                const bx = b.x * 10 + b.y;
                return ax - bx;
            });
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
            size: data.size,
            opacity: data.opacity,
            ghost: data.ghost,
            tangible: data.tangible,
            light: data.light,
            tile: data.tile
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
        id = id | 0;
        const iThing = state.things.findIndex(t => t.id === id);
        if (iThing >= 0) {
            state.things.splice(iThing, 1);
            state.grid.forEach(row => row.forEach(cell => {
                const things = cell.things;
                for (let iTh = things.length - 1; iTh >= 0; --iTh) {
                    if (things[iTh].id === id) {
                        things.splice(iTh, 1);
                    }
                }
            }));
        } else {
            throw new Error('could not find thing #' + id);
        }
    },

    [MUTATION.MOVE_THING]: (state, {idSource, idTarget}) => {
        const things = state.things;
        const iSrc = things.findIndex(t => t.id === idSource);
        if (iSrc < 0) {
            throw new Error('could not get source thing : ' + idSource);
        }
        const oTile = things[iSrc];
        const iTrg = things.findIndex(t => t.id === idTarget);
        if (iTrg >= 0) {
            things.splice(iSrc, 1);
            things.splice(iTrg, 0, oTile);
        } else {
            throw new Error('could not get target things : ' + idTarget);
        }
    },

    [MUTATION.REMOVE_CELL_THING]: (state, {xc, yc, xt, yt}) => {
        const aThings = state.grid[yc][xc].things;
        const iThing = aThings.findIndex(t => t.x === xt && t.y === yt);
        if (iThing >= 0) {
            aThings.splice(iThing, 1);
        }
    },

    [MUTATION.SETUP_AMBIANCE]: (state, value) => {
        const a = state.ambiance;
        a.sky = value.sky;
        a.fog.color = value.fog.color;
        a.fog.distance = value.fog.distance;
        a.filter.enabled = value.filter.enabled;
        a.filter.color = value.filter.color;
        a.brightness = value.brightness;
    },

    [MUTATION.SET_FLAG_STRETCH]: (state, {value}) => {
        state.flags.stretch = !!value;
    },

    [MUTATION.SET_FLAG_SMOOTH]: (state, {value}) => {
        state.flags.smooth = !!value;
    },

    [MUTATION.SET_FLAG_EXPORT]: (state, {value}) => {
        state.flags.export = !!value;
    },

    [MUTATION.SET_TILE_WIDTH]: (state, {value}) => {
        const newWidth = value;
        const prevWidth = state.metrics.tileWidth;
        const f = x => Math.floor(x * newWidth / prevWidth);
        state.blocks.forEach(b => {
            b.offs = f(b.offs);
            b.light.inner = f(b.light.inner);
            b.light.outer = f(b.light.outer);
        });
        state.ambiance.fog.distance = f(state.ambiance.fog.distance);
        state.things.forEach(s => {
            s.size = f(s.size);
        });
        state.metrics.tileWidth = newWidth;
    },

    [MUTATION.SET_TILE_HEIGHT]: (state, {value}) => {
        state.metrics.tileHeight = value;
    },

    [MUTATION.SET_PREVIEW]: (state, {value}) => {
        state.preview = value;
    },

    [MUTATION.REPLACE_TILE_CONTENT]: (state, {type, id, content}) => {
        const tile = state.tiles[type].find(t => t.id === id);
        if (!!tile) {
            tile.content = content;
        }
    },

    [MUTATION.SET_STARTING_POINT]: (state, {id, x, y, angle}) => {
        state.startpoints[id].x = x;
        state.startpoints[id].y = y;
        state.startpoints[id].z = 1;
        state.startpoints[id].angle = angle;
    },

    [MUTATION.ADD_STARTING_POINT]: state => {
        state.startpoints.push({
            x: -1,
            y: -1,
            z: 1,
            angle: 0
        });
    },

    [MUTATION.REMOVE_STARTING_POINT]: (state, {id}) => {
        state.startpoints.splice(id, 1);
        if (state.actor.startpoint >= state.startpoints.length) {
            state.actor.startpoint = state.startpoints.length - 1;
        }
    },

    [MUTATION.SET_ACTOR_STARTING_POINT]: (state, {id}) => {
        state.actor.startpoint = parseInt(id);
    },

    [MUTATION.SET_CAMERA_THINKER]: (state, {value}) => {
        state.actor.thinker = value;
    },

    [MUTATION.SHIFT_GRID]: (state, {direction}) => {
        const gl = state.grid.length;
        if (gl === 0) {
            return;
        }
        moveStartpoint(state.startpoint, gl, gl, direction);
        shiftArray(state.grid, direction);
    },

    [MUTATION.SHIFT_REGION]: function(state, {direction, region}) {
        const gl = state.grid.length;
        if (gl === 0) {
            return;
        }
        const localGrid = [];
        const {x1, y1, x2, y2} = region;
        // copier la partie de grille qui va bouger
        for (let y = 0; y < (y2 - y1 + 1); ++y) {
            const row = [];
            for (let x = 0; x < (x2 - x1 + 1); ++x) {
                row.push(state.grid[y + y1][x + x1]);
            }
            localGrid.push(row);
        }
        if (state.startpoint.x >= x1
            && state.startpoint.x <= x2
            && state.startpoint.y >= y1
            && state.startpoint.y <= y2
        ) {
            const localStartPoint = {x: state.startpoint.x - x1, y: state.startpoint.y - y1};
            moveStartpoint(localStartPoint, x2 - x1 + 1, y2 - y1 + 1, direction);
            state.startpoint.x = localStartPoint.x + x1;
            state.startpoint.y = localStartPoint.y + y1;
        }
        shiftArray(localGrid, direction);
        // replacer la grille
        for (let y = 0; y < (y2 - y1 + 1); ++y) {
            for (let x = 0; x < (x2 - x1 + 1); ++x) {
                state.grid[y + y1][x + x1] = localGrid[y][x];
            }
        }
    }
}