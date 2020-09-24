export default {
    tiles: {
        walls: [],
        flats: [],
        sprites: [],
    },
    blocks: [],
    things: [],
    grid: [],
    metrics: {
        tileHeight: 96,
        tileWidth: 64
    },
    flags: {
        smooth: false,
        stretch: false,
        export: false
    },
    time: {
        interval: 40
    },
    ambiance: {
        sky: '',
        fog: {
            distance: 50,
            color: 'black'
        },
        filter: {
            enabled: false,
            color: ''
        },
        brightness: 0
    },
    actor: {
        thinker: '',
        startpoint: 0,
    },
    startpoints: [{
        x: -1,
        y: -1,
        z: 1,
        angle: 0
    }],
    preview: ''
};