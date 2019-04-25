import * as MUTATION from '../modules/level/mutation-types';
import * as CONSTS from '../../consts';
import {render} from '../../libraries/block-renderer';
import CanvasHelper from "../../../../../src/canvas-helper";

export default store => {

    const getTile = function(state, type, id) {
        const oTile = state.level.tiles[type + 's'].find(t => t.id === id);
        return !!oTile ? oTile.content : '';
    };

    store.subscribe((mutation, state) => {
        if (mutation.type === ('level/' + MUTATION.DEFINE_BLOCK)) {
            // transformer les face en tile-src
            const payload = mutation.payload;
            const inFaces = payload.faces;
            const oFaces = {
                n: getTile(state, CONSTS.TILE_TYPE_WALL, inFaces.n),
                e: getTile(state, CONSTS.TILE_TYPE_WALL, inFaces.e),
                w: getTile(state, CONSTS.TILE_TYPE_WALL, inFaces.w),
                s: getTile(state, CONSTS.TILE_TYPE_WALL, inFaces.s),
                f: getTile(state, CONSTS.TILE_TYPE_FLAT, inFaces.f),
                c: getTile(state, CONSTS.TILE_TYPE_FLAT, inFaces.c)
            };
            // calculer le block rendu
            render(CanvasHelper.createCanvas(128, 128), payload.phys, oFaces).then(oCanvas => {
                const sSrc = CanvasHelper.getData(oCanvas);
                store.commit('level/' + MUTATION.SET_BLOCK_PREVIEW, {id: payload.id, content: sSrc});
            });
        }
    });
};
