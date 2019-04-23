export default {
    getWallTiles: state => state.tiles.filter(t => t.type === 'wall'),
    getFlatTiles: state => state.tiles.filter(t => t.type === 'flat'),
    getTile: state => tid => state.tiles.find(t => t.id === tid),
    getTileHeight: state => state.metrics.tileHeight,
    getTileWidth: state => state.metrics.tileWidth,
}