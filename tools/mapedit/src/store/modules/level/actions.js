import * as ACTION from './action-types';
import * as MUTATION from './mutation-types';
import CanvasHelper from "../../../../../../libs/canvas-helper";
import CACHE from "../../../libraries/block-cache";
import {deleteLevel, exportLevel, loadLevel, saveLevel} from '../../../libraries/fetch-helper';
import * as CONSTS from "../../../consts";
import {render} from "../../../libraries/block-renderer";



function getTile(tiles, type, id) {
    const oTile = tiles[type + 's'].find(t => t.id === id);
    return !!oTile ? oTile.content : '';
}

function renderAndStoreBlock(tiles, data) {
    return new Promise(resolve => {
        // transformer les face en tile-src
        const inFaces = data.faces;
        const oFaces = {
            n: getTile(tiles, CONSTS.TILE_TYPE_WALL, inFaces.n),
            e: getTile(tiles, CONSTS.TILE_TYPE_WALL, inFaces.e),
            w: getTile(tiles, CONSTS.TILE_TYPE_WALL, inFaces.w),
            s: getTile(tiles, CONSTS.TILE_TYPE_WALL, inFaces.s),
            f: getTile(tiles, CONSTS.TILE_TYPE_FLAT, inFaces.f),
            c: getTile(tiles, CONSTS.TILE_TYPE_FLAT, inFaces.c)
        };
        // calculer le block rendu
        render(CanvasHelper.createCanvas(CONSTS.BLOCK_WIDTH, CONSTS.BLOCK_HEIGHT), data.phys, oFaces, !!data.light.enabled).then(oCanvas => {
            const sSrc = CanvasHelper.getData(oCanvas);
            CACHE.store(data.id, oCanvas);
            resolve({id: data.id, content: sSrc});
        });
    });
}




export default {

    /**
     * pushes a new tile in the collection
     * @param commit
     * @param content {string}
     */
    [ACTION.LOAD_TILE]: async ({commit, getters, state}, {type, content}) => {
        const oCvs = await CanvasHelper.loadCanvas(content);
        commit(MUTATION.ADD_TILE, {id: getters.getMaxTileId + 1, type, content, width: oCvs.width, height: oCvs.height});
    },

    /**
     * pushes a new tile in the collection
     * @param commit
     * @param content {string}
     */
    [ACTION.LOAD_TILES]: async ({commit, getters, state}, {type, contents}) => {
        let id = getters.getMaxTileId + 1;
        for (let i = 0, l = contents.length; i < l; ++i) {
            const content = contents[i];
            const oCvs = await CanvasHelper.loadCanvas(content);
            commit(MUTATION.ADD_TILE, {id: id + i, type, content, width: oCvs.width, height: oCvs.height});
        }
    },

    /**
     * reorder tiles : move a tile from its position to another tile's position
     * @param commit
     * @param idSource
     * @param idTarget
     */
    [ACTION.REORDER_TILE]: ({commit, getters}, {idSource, idTarget}) => {
        const tileSource = getters.getTile(idSource);
        commit(MUTATION.MOVE_TILE, {type: tileSource.type, idSource, idTarget});
    },

    /**
     * define animation properties
     * @param commit
     * @param start {number} identified of the initial frame
     * @param duration {number} duration of each aniamtion frame (in ms)
     * @param frames {number} number of frames in the animation
     * @param loop {number} type of loop
     */
    [ACTION.SET_TILE_ANIMATION]: ({commit, getters}, {start, duration, frames, loop}) => {
        const tile = getters.getTile(start);
        commit(MUTATION.SET_TILE_ANIMATION, {type: tile.type, start, duration, frames, loop});
    },

    /**
     * Supprime les donnée d'animation associée à une tile initiale
     * @param commit
     * @param getters
     * @param idTile {number} identifiant de la tile
     */
    [ACTION.CLEAR_TILE_ANIMATION]: ({commit, getters}, {idTile}) => {
        const tile = getters.getTile(idTile);
        commit(MUTATION.CLEAR_TILE_ANIMATION, {type: tile.type, tile});
    },

    /**
     * suppression de la tile spécifiée
     * @param commit
     * @param getters
     * @param id {number} identifiant de la tile qu'on veut supprimer
     */
    [ACTION.DELETE_TILE]: ({commit, getters}, {id}) => {
        const tile = getters.getTile(id);
        if (!tile) {
            throw new Error('could not find this tile : ' + id);
        }
        commit(MUTATION.DELETE_TILE, {type: tile.type, id});
    },


    /**
     * creation d'un block
     */
    [ACTION.CREATE_BLOCK]: async ({commit, getters}, data) => {
        const id = getters.getMaxBlockId + 1;
        if (!id) {
            throw new Error('the computed id is invalid');
        }
        const oBlock = {
            id,
            ...data
        };
        commit(MUTATION.DEFINE_BLOCK, oBlock);
        const {content} = await renderAndStoreBlock(getters.getTiles, oBlock);
        commit(MUTATION.SET_BLOCK_PREVIEW, {id, content});
    },

    [ACTION.MODIFY_BLOCK]: async ({commit, getters}, data) => {
        const id = data.id | 0;
        commit(MUTATION.DEFINE_BLOCK, data);
        const {content} = await renderAndStoreBlock(getters.getTiles, data);
        commit(MUTATION.SET_BLOCK_PREVIEW, {id, content});
    },

    /**
     * Effacer block
     * @param commit
     * @param id
     */
    [ACTION.DELETE_BLOCK]: ({commit, }, {id}) => {
        commit(MUTATION.DESTROY_BLOCK, {id});
    },


    [ACTION.SET_GRID_SIZE]: ({commit}, {value}) => {
        commit(MUTATION.SET_GRID_SIZE, {size: value});
    },

    [ACTION.SET_CELL_PROPS]: ({commit}, data) => {
        const {x, y} = data;
        for(let sProp in data) {
            const value = data[sProp];
            switch (sProp) {
                case 'block':
                    commit(MUTATION.SET_CELL_BLOCK, {x, y, value});
                    break;

                case 'upperblock':
                    commit(MUTATION.SET_CELL_UPPER_BLOCK, {x, y, value});
                    break;

                case 'tags':
                    commit(MUTATION.SET_CELL_TAGS, {x, y, value});
                    break;

                case 'mark': {
                    const a = value.split(' ');
                    commit(MUTATION.SET_CELL_MARK, {x, y, color: a[0], shape: a[1]});
                    break;
                }

                case 'thing':
                    commit(MUTATION.SET_CELL_THING, {x, y, xt: value.x, yt: value.y, id: value.id});
                    break;
            }
        }
    },

    [ACTION.SET_CELL_MARK]: ({commit}, {x, y, shape, color}) => {
        commit(MUTATION.SET_CELL_MARK, {x, y, shape, color})
    },

    [ACTION.ADD_CELL_TAG]: ({commit}, {x, y, value}) => {
        commit(MUTATION.ADD_CELL_TAG, {x, y, value});
    },

    [ACTION.REMOVE_CELL_TAG]: ({commit}, {x, y, value}) => {
        commit(MUTATION.REMOVE_CELL_TAG, {x, y, value});
    },

    [ACTION.LOAD_LEVEL]: async ({commit}, {name}) => {
        const content = await loadLevel(name);
        if (!content) {
            throw new Error('an error occurred while loading level "' + name + '"');
        }
        commit(MUTATION.SET_STATE_CONTENT, {content});
        const blocks = content.blocks;
        for (let i = 0, l = blocks.length; i < l; ++i) {
            const b = blocks[i];
            const sSrc = b.preview;
            const oCanvas = await CanvasHelper.loadCanvas(sSrc);
            CACHE.store(b.id, oCanvas);
            commit(MUTATION.SET_BLOCK_PREVIEW, {id: b.id, content: sSrc});
        }
    },

    [ACTION.SET_GRID_CELL]: ({commit}, {x, y, floor, block}) => {
        switch (floor) {
            case 0:
                commit(MUTATION.SET_CELL_BLOCK, {x, y, value: block});
                break;

            case 1:
                commit(MUTATION.SET_CELL_UPPER_BLOCK, {x, y, value: block});
                break;

            default:
                throw new Error('setting cell block : this floor is invalid ' + floor);
        }
    },

    [ACTION.SET_GRID_CELLS]: ({commit}, {xy, floor, block}) => {
        switch (floor) {
            case 0:
                xy.forEach(({x, y}) => commit(MUTATION.SET_CELL_BLOCK, {x, y, value: block}));
                break;

            case 1:
                xy.forEach(({x, y}) => commit(MUTATION.SET_CELL_UPPER_BLOCK, {x, y, value: block}));
                break;

            default:
                throw new Error('setting cell block : this floor is invalid ' + floor);
        }
    },

    [ACTION.CREATE_THING]: ({commit, getters}, data) => {
        const id = getters.getMaxThingId + 1;
        commit(MUTATION.DEFINE_THING, {id, ...data});
    },

    [ACTION.MODIFY_THING]: ({commit, getters}, data) => {
        commit(MUTATION.DEFINE_THING, data);
    },

    [ACTION.DELETE_THING]: ({commit}, {id}) => {
        commit(MUTATION.DESTROY_THING, {id});
    },


    /**
     * reorder tiles : move a tile from its position to another tile's position
     * @param commit
     * @param idSource
     * @param idTarget
     */
    [ACTION.REORDER_THING]: ({commit, getters}, {idSource, idTarget}) => {
        commit(MUTATION.MOVE_THING, {idSource, idTarget});
    },


    [ACTION.REMOVE_CELL_THING]: ({commit}, {xc, yc, xt, yt}) => {
        commit(MUTATION.REMOVE_CELL_THING, {xc, yc, xt, yt});
    },

    [ACTION.SETUP_AMBIANCE]: ({commit}, value) => {
        commit(MUTATION.SETUP_AMBIANCE, value);
    },

    [ACTION.SET_FLAG]: ({commit}, {flag, value}) => {
        switch (flag) {
            case 'smooth':
                commit(MUTATION.SET_FLAG_SMOOTH, {value});
                break;

            case 'stretch':
                commit(MUTATION.SET_FLAG_STRETCH, {value});
                break;

            case 'export':
                commit(MUTATION.SET_FLAG_EXPORT, {value});
                break;

            default:
                throw new Error('this flag is unknown : "' + flag + '"');
        }
    },

    [ACTION.SET_TILE_WIDTH]: ({commit}, {value}) => {
        commit(MUTATION.SET_TILE_WIDTH, {value});
    },

    [ACTION.SET_TILE_HEIGHT]: ({commit}, {value}) => {
        commit(MUTATION.SET_TILE_HEIGHT, {value});
    },

    [ACTION.SET_PREVIEW]: ({commit}, {value}) => {
        commit(MUTATION.SET_PREVIEW, {value});
    },

    [ACTION.REPLACE_TILE_CONTENT]: ({commit}, {id, type, content}) => {
        commit(MUTATION.REPLACE_TILE_CONTENT, {id, type, content});
    },

    [ACTION.FEEDBACK_TILE_WIDTH]: ({commit}, {from, to}) => {
        commit(MUTATION.REPLACE_BLOCK_OFFSET, {from, to});
    },

    [ACTION.SET_STARTING_POINT]: ({commit}, {x, y, angle}) => {
        commit(MUTATION.SET_STARTING_POINT, {x, y, angle});
    },

    [ACTION.SHIFT_GRID]: ({commit}, {direction}) => {
        commit(ACTION.SHIFT_GRID, {direction});
    }
}