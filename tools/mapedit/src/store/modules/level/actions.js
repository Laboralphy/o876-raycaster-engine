import * as ACTION from './action-types';
import * as MUTATION from './mutation-types';
import CanvasHelper from "../../../../../../src/canvas-helper";
import CACHE from "../../../libraries/block-cache";
import {loadLevel, saveLevel} from '../../../libraries/fetch-helper';

export default {

    /**
     * pushes a new tile in the collection
     * @param commit
     * @param content {string}
     */
    [ACTION.LOAD_TILE]: ({commit, getters, state}, {type, content}) => {
        commit(MUTATION.ADD_TILE, {id: getters.getMaxTileId + 1, type, content});
    },

    /**
     * pushes a new tile in the collection
     * @param commit
     * @param content {string}
     */
    [ACTION.LOAD_TILES]: ({commit, getters, state}, {type, contents}) => {
        let id = getters.getMaxTileId + 1;
        for (let i = 0, l = contents.length; i < l; ++i) {
            commit(MUTATION.ADD_TILE, {id: id + i, type, content: contents[i]});
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
    [ACTION.CREATE_BLOCK]: ({commit, getters}, data) => {
        const oBlock = {
            id: getters.getMaxBlockId + 1,
            ...data
        };
        commit(MUTATION.DEFINE_BLOCK, oBlock);
    },

    [ACTION.MODIFY_BLOCK]: ({commit}, data) => {
        commit(MUTATION.DEFINE_BLOCK, data);
    },

    /**
     * Effacer block
     * @param commit
     * @param id
     */
    [ACTION.DELETE_BLOCK]: ({commit}, {id}) => {
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
                    commit(MUTATION.SET_CELL_THING, {x, y, id: value});
                    break;
            }
        }
    },

    [ACTION.ADD_CELL_TAG]: ({commit}, {x, y, value}) => {
        commit(MUTATION.ADD_CELL_TAG, {x, y, value});
    },

    [ACTION.REMOVE_CELL_TAG]: ({commit}, {x, y, value}) => {
        commit(MUTATION.REMOVE_CELL_TAG, {x, y, value});
    },

    [ACTION.SAVE_LEVEL]: async ({commit, getters}, {name}) => {
        await saveLevel(name, getters.getLevel);
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
    }

}