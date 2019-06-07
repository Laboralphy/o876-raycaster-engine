const LOOPS = ['@LOOP_NONE', '@LOOP_FORWARD', '@LOOP_YOYO'];
const DEFAULT_ANIMATION_NAME = 'default';

let combineTiles = async function() {};

function setImageAppender(f) {
    combineTiles = f;
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
            "id": string, //
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
    const output = {id: idTile};
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
        [DEFAULT_ANIMATION_NAME]: {
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
    const output = [];
    for (let i = 0; i < tilesets.length; ++i) {
        const ts = tilesets[i];
        output.push(await generateTileset(tilesets, ts.id));
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
        {
            "id": string, // identifier blueprint
            "tileset": string, // name of the tilset used
            "thinker": string, // reference of the AI thinker
            "size": number // physical size (for collision)
        }, ...
    }

     */
    const output = {id};
    const thing = things.find(t => t.id === id);
    if (!thing) {
        throw new Error('blueprint referenced thing "' + id + '" which could not be found');
    }
    output.tileset = thing.tile;
    output.thinker = thing.tangible ? 'TangibleThinker' : 'StaticThinker';
    output.size = thing.size | 0;
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
    const output = [];
    for (let i = 0; i < things.length; ++i) {
        const th = things[i];
        output.push(generateBlueprint(things, th.id));
    }
    return output;
}


function generateMetrics(input) {
    return {
        spacing: input.metrics.tileWidth | 0,
        height: input.metrics.tileHeight | 0
    };
}

async function generateTextures(input) {
    const walls = await combineTiles(input.tiles.walls, 0, input.tiles.walls.length);
    const flats = await combineTiles(input.tiles.flats, 0, input.tiles.flats.length);
    return {
        flats: flats.src,
        walls: walls.src,
        sky: input.ambiance.sky,
        smooth: !!input.flags.smooth,
        stretch: !!input.flags.stretch
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


    // ca ne marche pas
    return {
        code: block.id,
        phys: block.phys,
        offset: block.offs | 0,
        faces: {
            n: generateFace(input, block.faces.n, 'wall'),
            e: generateFace(input, block.faces.e, 'wall'),
            w: generateFace(input, block.faces.w, 'wall'),
            s: generateFace(input, block.faces.s, 'wall'),
            f: generateFace(input, block.faces.f, 'flat'),
            c: generateFace(input, block.faces.c, 'flat'),
        },
        light: block.light.enabled ? {
            r0: block.light.inner | 0,
            r1: block.light.outer | 0,
            v:  parseFloat(block.light.value)
        } : null
    };
}

function generateLegends(input) {
    return input.blocks.map(b => generateLegend(input, b));
}

async function generateLevel(input) {
    return {
        ...generateMap(input),
        legend: generateLegends(input),
        textures: await generateTextures(input),
        metrics: generateMetrics(input)
    };
}

function generateShading(input) {
    const a = input.ambiance;
    return {
        color: a.fog.color,      // fog color
        factor: a.fog.distance | 0,     // distance (texels) where the texture shading increase by one unit
        brightness: a.brightness | 0, // base brightness
        filter: a.filter.enabled && a.filter.length > 0 ? a.filter.color : false,    // color filter for sprites (ambient color)
    };
}

function generateObjectsAndDecals(input) {
    const aObjects = [];
    const aDecals = [];
    const ps = input.metrics.tileWidth | 0;
    const grid = input.grid;
    const blocks = input.blocks;
    const tiles = input.tiles.sprites;
    const thingTemplates = input.things;
    grid.forEach((row, y) => row.forEach((cell, x) => {
        // déterminer si on est dans une cellule walkable (sinon c'est un decal
        const oBlock = blocks.find(b => b.id === cell.block);
        const phys = !!oBlock ? oBlock.phys : 0;
        const bWalkable = phys === 0;
        cell.things.forEach(thing => {
            const idThingTemplate = thing.id;
            const oTT = thingTemplates.find(tt => tt.id === idThingTemplate);
            if (!oTT) {
                throw new Error('cell x:' + x + ' y:' + y + ' references tile id:' + idThingTemplate + ' - but the tile template could not be found in store');
            }
            if (bWalkable) {
                const oTile = tiles.find(t => t.id === oTT.tile);
                const size = oTT.size | 0;
                const zp = [size, ps >> 1, ps - size];
                const xp = x * ps + zp[thing.x];
                const yp = y * ps + zp[thing.y];
                // déterminer s'il y a animation
                aObjects.push({
                    x: xp,
                    y: yp,
                    angle: 0,
                    blueprint: idThingTemplate,
                    animation: !!oTile.animation ? DEFAULT_ANIMATION_NAME : false
                });
            } else {
                // il s'agit d'un decal
                // déterminer la face et l'alignement
                const decal = {
                    x,
                    y
                };
                const tileset = oTT.tile;
                switch (thing.x * 10 + thing.y) {
                    case 0:
                        decal.w = { tileset, align: '@ALIGN_LEFT' };
                        decal.n = { tileset, align: '@ALIGN_RIGHT' };
                        break;

                    case 10:
                        decal.n = { tileset, align: '@ALIGN_CENTER' };
                        break;

                    case 20:
                        decal.n = { tileset, align: '@ALIGN_LEFT' };
                        decal.e = { tileset, align: '@ALIGN_RIGHT' };
                        break;

                    case 1:
                        decal.w = { tileset, align: '@ALIGN_CENTER' };
                        break;

                    case 11:
                        break;

                    case 21:
                        decal.e = { tileset, align: '@ALIGN_CENTER' };
                        break;

                    case 2:
                        decal.w = { tileset, align: '@ALIGN_RIGHT' };
                        decal.s = { tileset, align: '@ALIGN_LEFT' };
                        break;

                    case 12:
                        decal.s = { tileset, align: '@ALIGN_CENTER' };
                        break;

                    case 22:
                        decal.s = { tileset, align: '@ALIGN_RIGHT' };
                        decal.e = { tileset, align: '@ALIGN_LEFT' };
                        break;
                }
                aDecals.push(decal);
            }
        });
    }));
    return {
        objects: aObjects,
        decals: aDecals
    };
}

function generateCamera(input) {
    // recherche de la "marque"
    return {
        x: input.startpoint.x,
        y: input.startpoint.y,
        angle: input.startpoint.angle * Math.PI,
        thinker: 'KeyboardControlThinker'
    };
}

function generateTags(input) {
    const aTags = [];
    input.grid.forEach(
        (row, y) => row.forEach(
            (cell, x) => {
                if (cell.tags.length) {
                    aTags.push({
                        x, y, tags: cell.tags.slice(0)
                    });
                }
            }
        )
    );
    return aTags;
}

async function generate(input, imageAppender) {
    if (!imageAppender) {
        throw new Error('need image appender');
    }
    setImageAppender(imageAppender);
    return {
        version: 'eng-100',
        tilesets: await generateTilesets(input),
        blueprints: generateBlueprints(input),
        level: await generateLevel(input),
        shading: generateShading(input),
        ...generateObjectsAndDecals(input),
        camera: generateCamera(input),
        tags: generateTags(input)
    };
}

module.exports = generate;