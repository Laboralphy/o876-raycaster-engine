export default {
    getWallTiles: state => state.tiles.filter(t => t.type === 'wall'),
    getFlatTiles: state => state.tiles.filter(t => t.type === 'flat'),
    getTileHeight: state => state.metrics.tileHeight,
    getTileWidth: state => state.metrics.tileWidth,
}