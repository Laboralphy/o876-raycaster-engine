import * as CONSTS from '../../../consts';

function redMaxId(prev, curr) {
    return Math.max(prev, curr.id);
}

function buildSmartTileGetter(sType) {
    return state => {
        // préparer les tile animée
        const stx = state.tiles[sType];
        const aAnimated = stx
            .map((tw, itw) => ({
                anim: !!tw.animation,
                indexMin: itw,
                indexMax: !tw.animation ? -1 : parseInt(tw.animation.frames) + itw - 1
            }))
            .filter(t => t.anim);
        return stx.filter((t, i) => aAnimated
            .filter(atw => atw.indexMin < i)
            .every(atw => atw.indexMax < i));
    };
}

export default {
    getMaxTileId: state =>
        Math.max(
            state
                .tiles
                .walls
                .reduce((prev, curr) => Math.max(prev, curr.id), 0),
            state
                .tiles
                .flats
                .reduce((prev, curr) => Math.max(prev, curr.id), 0),
            state
                .tiles
                .sprites
                .reduce((prev, curr) => Math.max(prev, curr.id), 0)
        ),
    getMaxBlockId: state => state.blocks.reduce(redMaxId, 0),
    getMaxThingId: state => state.things.reduce(redMaxId, 0),
    getTimeInterval: state => state.time.interval,
    getWallTiles: buildSmartTileGetter('walls'),
    getFlatTiles: buildSmartTileGetter('flats'),
    getSpriteTiles: buildSmartTileGetter('sprites'),
    getWallFrames: state => state.tiles.walls,
    getFlatFrames: state => state.tiles.flats,
    getSpriteFrames: state => state.tiles.sprites,
    getWallTile: state => tid => state.tiles.walls.find(t => t.id === tid),
    getFlatTile: state => tid => state.tiles.flats.find(t => t.id === tid),
    getSpriteTile: state => tid => state.tiles.sprites.find(t => t.id === tid),
    getTiles: state => state.tiles,
    getTile: state => tid => state.tiles.walls.find(t => t.id === tid) || state.tiles.flats.find(t => t.id === tid) || state.tiles.sprites.find(t => t.id === tid),
    getThing: state => tid => state.things.find(t => t.id === tid),
    getTileHeight: state => state.metrics.tileHeight,
    getTileWidth: state => state.metrics.tileWidth,
    getBlocks: state => state.blocks.sort((b1, b2) => b1.phys - b2.phys),
    getStartpoint: state => state.startpoint,
    getGrid: state => state.grid,
    getGridSize: state => state.grid.length,
    getLevel: state => state,
    getThings: state => state.things,
    getAmbiance: state => state.ambiance,
    getFlagSmooth: state => state.flags.smooth,
    getFlagStretch: state => state.flags.stretch,
    getFlagExport: state => state.flags.export
}