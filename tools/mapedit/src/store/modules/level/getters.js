export default {
    getWallTiles: state => state.tiles.filter(t => t.type === 'wall'),
    getFlagTiles: state => state.tiles.filter(t => t.type === 'flat'),
    getTileHeight: state => state.metrics.tileHeight,
    getTileWidth: state => state.metrics.tileWidth,
}