import * as CONSTS from '../../../../../../src/raycaster/consts';

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
                .reduce((prev, curr) => Math.max(prev, curr.id), 0)
        ),
    getMaxBlockId: state => state.blocks.reduce((prev, curr) => Math.max(prev, curr.id), 0),
    getTimeInterval: state => state.time.interval,
    getWallTiles: state => state.tiles.walls,
    getFlatTiles: state => state.tiles.flats,
    getWallTile: state => tid => state.tiles.walls.find(t => t.id === tid),
    getFlatTile: state => tid => state.tiles.flats.find(t => t.id === tid),
    getTile: state => tid => state.tiles.walls.find(t => t.id === tid) || state.tiles.flats.find(t => t.id === tid),
    getTileHeight: state => state.metrics.tileHeight,
    getTileWidth: state => state.metrics.tileWidth,

    getBlocks: state => state.blocks.sort((b1, b2) => b1.phys - b2.phys),

    getGrid: state => state.grid,
    getGridSize: state => state.grid.length
}