// main

import rclib from '../../src';

const {TileSet, ShadedTileSet, CanvasHelper} = rclib;


async function main() {
	let cvs = document.querySelector('canvas');
	let ctx = cvs.getContext('2d');
	let cWall = await CanvasHelper.loadCanvas('textures/walls.png');
	let ts = new TileSet();
	ts.setTileWidth(64);
	ts.setTileHeight(96);
	ts.setImage(cWall); 
	let sts = new ShadedTileSet();
	sts.setTileSet(ts);
	sts.compute('#000000', '#808080', 0);
	ctx.drawImage(sts._tileSets[5].getImage(), 0, 0);
}

window.addEventListener('load', main);
