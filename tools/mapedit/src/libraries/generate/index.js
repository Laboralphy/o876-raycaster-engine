import CanvasHelper from "../../../../../src/canvas-helper";

const LOOPS = ['@LOOP_NONE', '@LOOP_FORWARD', '@LOOP_YOYO'];


/**
 * Combine plusieurs tiles en une seule et renvoie les data-images
 * @param tilesets {array}
 * @param iStart
 * @param count
 * @return {Promise<*>}
 */
async function combineTiles(tilesets, iStart, count) {
    // déterminer la liste des frames à recombiner
    const aAllTiles = [];
    for (let i = 0; i < count; ++i) {
        aAllTiles.push(tilesets[iStart + i].content);
    }
    const proms = aAllTiles.map(t => CanvasHelper.loadCanvas(t));
    const aCanvases = await Promise.all(proms);
    const w = aCanvases[0].width;
    const h = aCanvases[0].height;
    const cvsOutput = CanvasHelper.createCanvas(w * count, h);
    const ctxOutput = cvsOutput.getContext('2d');
    for (let i = 0; i < count; ++i) {
        ctxOutput.drawImage(aCanvases[0], i * w, 0);
    }
    return {
        src: CanvasHelper.getData(cvsOutput),
        width: w | 0,
        height: h | 0
    };
}


async function generateTileset(tilesets, idTile) {
    /*
      une tile dans le state c'est cela :
      {
            id,             // identifiant numérique 1+
            type,           // toujour sprite
            content,        // contenu du PNG de la tile
            animation       // il n'y a qu'une seule animation
                {duration, frames, loop}
      }

      on doit convertir en :
      {
            "src": string, // image source of tileset
            "width": number, // frame width
            "height": number, // frame height
            "animations": {
                "((animation-name))": {
                    "start": [number * 8],
                    "length": number, // number of frame in this animation
                    "loop": string, // type of loop @LOOP_NONE, @LOOP_FORWARD, @LOOP_YOYO
                    "duration": number, // frame duration
                    "iterations": number, // number of iterations (optional default Infinity)
                }, ...
            }
      }

      lorqu'il y a animation, il faut recombiner toutes les tiles en une seule.
     */
    const output = {};
    const iTileIndex = tilesets.findIndex(t => t.id === idTile);
    if (iTileIndex < 0) {
        throw new Error('this tileset does not exist : ' + idTile);
    }
    const tile = tilesets[iTileIndex];
    // déterminer de suite s'il y a des tiles à recombiner
    // c'est le travail le plus difficile
    const nFrames = !!tile.animation ? tile.animation.frames : 1;
    const {src, width, height} = await combineTiles(tilesets, iTileIndex, nFrames);
    output.src = src;
    output.width = width;
    output.height = height;
    output.animations = nFrames > 1 ? {
        default: {
            start: [0, 0, 0, 0, 0, 0, 0, 0],
            length: nFrames | 0,
            duration: tile.animation.duration | 0,
            loop: LOOPS[tile.animation.loop]
        }
    } : null;
    return output;
}

async function generateTilesets(input) {
    const tilesets = input.tiles.sprites;
    const output = {};
    for (let i = 0; i < tilesets.length; ++i) {
        const ts = tilesets[i];
        output[ts.id] = await generateTileset(tilesets, ts.id)
    }
    return output;
}


function generateBlueprint(things, id) {
    /*

    format du state
    {
            id: data.id,
            ref: data.ref,
            opacity: data.opacity,
            ghost: data.ghost,
            size: data.size,
            tangible: data.tangible,
            light: data.light,
            tile: data.tile
    }

    format du RC
    {
        "((name-of-blueprint": {
            "tileset": string, // name of the tilset used
            "thinker": string, // reference of the AI thinker
            "size": number // physical size (for collision)
        }, ...
    }

     */
    const output = {};
    const thing = things.find(t => t.id === id);
    output.tileset = thing.tile;
    output.thinker = thing.tangible ? 'TangibleThinker' : 'StaticThinker';
    output.size = thing.size;
    output.ref = thing.ref;
    output.fx = [];
    if (thing.ghost) {
        output.fx.push('@FX_LIGHT_ADD');
    }
    if (thing.light) {
        output.fx.push('@FX_LIGHT_SOURCE');
    }
    switch (thing.opacity) {
        case 0: // 100%
            break;

        case 1: // 75%
            output.fx.push('@FX_ALPHA_75');
            break;

        case 2: // 50%
            output.fx.push('@FX_ALPHA_50');
            break;

        case 3: // 25%
            output.fx.push('@FX_ALPHA_25');
            break;
    }
    return output;
}

function generateBlueprints(input) {
    const things = input.things;
    const output = {};
    for (let i = 0; i < things.length; ++i) {
        const th = things[i];
        output[th.id] = generateBlueprint(things, th.id);
    }
    return output;
}


function generateMetrics(input) {
    return {
        spacing: input.metrics.tileWidth,
        height: input.metrics.tileHeight
    };
}

async function generateTextures(input) {
    const walls = await combineTiles(input.tiles.walls, 0, input.tiles.walls.length);
    const flats = await combineTiles(input.tiles.flats, 0, input.tiles.flats.length);
    return {
        flats,
        walls,
        sky: input.ambiance.sky,
        smooth: input.flats.smooth,
        stretch: input.flats.stretch
    };
}

function generateMap(input) {
    /*
    state cell format :
    {
        block: 0,
        upperblock: 0,
        tags: [],
        mark: {
            color: 0,
            shape: 0
        },
        modified: false,
        things: []
    }
     */

    const output = {};
    // déterminer s'il y a un uppermap
    const grid = input.grid;
    const bHasUpperMap = grid.some(row => row.some(cell => cell.upperblock !== 0));
    output.map = grid.map(row => row.map(cell => cell.block));
    if (bHasUpperMap) {
        output.uppermap = grid.map(row => row.map(cell => cell.upperblock))
    }
    return output;
}

function generateFace(input, id, type) {
    if (id === null) {
        return null;
    }
    const tiles = input.tiles[type + 's'];
    const tileIndex = tiles.findIndex(t => t.id === id);
    if (tileIndex < 0) {
        throw new Error('this tile is not defined : ' + id)
    }
    const tile = tiles[tileIndex];
    if (tile.animation) {
        return [tileIndex, tile.animation.frames | 0, tile.animation.duration | 0, LOOPS[tile.animation.loop | 0]];
    } else {
        return tileIndex;
    }
}

function generateLegend(input, block) {
    /*

    state format

            id: data.id,
            ref: data.ref,
            phys: data.phys,
            offs: data.offs,
            preview: '',
            light: {
                enabled: data.light.enabled,
                value: data.light.value,
                inner: data.light.inner,
                outer: data.light.outer
            },
            faces: {
                n: data.faces.n,
                e: data.faces.e,
                w: data.faces.w,
                s: data.faces.s,
                f: data.faces.f,
                c: data.faces.c,
            }

    rc format
        {
            "code": number|char, // references the items inside the 2D "map"
            "phys": string, // @PHYS_NONE, @PHYS_...
            "offset": number, // optional offset value
            "faces": {
                "n": number|array, // if array then animation : [start, length, duration, loop]
                "e": number|array,
                "w": number|array,
                "s": number|array,
                "f": number|array,
                "c": number|array
            },
            "light": {  // optional static light parameters
                "r0": number,
                "r1": number,
                "v"
            }
        }

     */

    return {
        code: block.id,
        phys: block.phys,
        offset: block.offs,
        faces: {
            n: generateFace(input, block.faces.n, 'wall'),
            e: generateFace(input, block.faces.e, 'wall'),
            w: generateFace(input, block.faces.w, 'wall'),
            s: generateFace(input, block.faces.s, 'wall'),
            f: generateFace(input, block.faces.f, 'flat'),
            c: generateFace(input, block.faces.c, 'flat'),
        },
        light: block.light.enabled ? {
            r0: block.light.inner,
            r1: block.light.outer,
            v:  block.light.value
        } : null
    };
}

function generateLegends(input) {
    return input.blocks.map(b => generateLegend(input, b));
}

function generateLevel(input) {
    return {
        ...generateMap(input),
        legend: generateLegends(input)
    };
}


export async function generate(input) {
    const output = {
        tilesets: await generateTilesets(input),
        blueprints: generateBlueprints(input),
        level: generateLevel(input)
    };
    return output;
}