export default {
    getWallTiles: state => state.tiles.walls,
    getFlatTiles: state => state.tiles.flats,
    getTile: state => tid => state.tiles.walls.find(t => t.id === tid) || state.tiles.flats.find(t => t.id === tid),
    getTileHeight: state => state.metrics.tileHeight,
    getTileWidth: state => state.metrics.tileWidth,
}