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
	let sts2 = sts.createFragment(3);
    ctx.drawImage(sts2._tileSets[0].getImage(), 0, 0);
    ctx.drawImage(sts2._tileSets[4].getImage(), 64, 96);
}

window.addEventListener('load', main);
