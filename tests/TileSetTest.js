// test
const TileSet = require('../src/raycaster/TileSet').default;

describe('#getTileRect', function() {
	it('should return rects', function() {
		let ts = new TileSet();
		ts.setTileWidth(64);
		ts.setTileHeight(96);
		ts.setImage({
			complete: true,
			naturalWidth: 256,
			naturalHeight: 512
		});
		expect(ts.getTileRect(0)).toEqual({x: 0, y: 0, width: 64, height: 96});		
		expect(ts.getTileRect(1)).toEqual({x: 64, y: 0, width: 64, height: 96});		
		expect(ts.getTileRect(2)).toEqual({x: 128, y: 0, width: 64, height: 96});		
		expect(ts.getTileRect(3)).toEqual({x: 192, y: 0, width: 64, height: 96});		
		expect(ts.getTileRect(4)).toEqual({x: 0, y: 96, width: 64, height: 96});		
	});
});



describe('#getTileCount', function() {
	it('should return exact number of tiles', function() {
		let ts = new TileSet();
		ts.setTileWidth(64);
		ts.setTileHeight(96);
		ts.setImage({
			complete: true,
			naturalWidth: 256,
			naturalHeight: 512
		});
		expect(ts.getTileCount()).toBe(20);
	});
});

