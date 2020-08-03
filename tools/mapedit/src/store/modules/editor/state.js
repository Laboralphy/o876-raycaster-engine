export default {


    data: {

        phys: [
            {
                id: 0,
                label: 'Walkable',
                desc: 'You can walk on this type of block',
                tiles: 'fc',
                offset: false
            },
            {
                id: 1,
                label: 'Solid',
                desc: 'You cannot walk on this type of block : this is a plain solid wall',
                tiles: 'news',
                offset: false
            },
            {
                id: 2,
                label: 'Door up',
                desc: 'This is a door that slides up when opened',
                tiles: 'fcnews',
                offset: false
            },
            {
                id: 3,
                label: 'Curtain up',
                desc: 'This is a curtain that slides up when opened',
                tiles: 'fcnews',
                offset: false
            },
            {
                id: 4,
                label: 'Door down',
                desc: 'This is a door that slides down when opened',
                tiles: 'fcnews',
                offset: false
            },
            {
                id: 5,
                label: 'Curtain down',
                desc: 'This is a curtain that slides down when opened',
                tiles: 'fcnews',
                offset: false
            },
            {
                id: 6,
                label: 'Door right',
                desc: 'This is a door that slides to the right when opened',
                tiles: 'fcnews',
                offset: false
            },
            {
                id: 7,
                label: 'Door left',
                desc: 'This is a door that slides to the left when opened',
                tiles: 'fcnews',
                offset: false
            },
            {
                id: 8,
                label: 'Door double',
                desc: 'This is a double panel door',
                tiles: 'fcnews',
                offset: false
            },
            {
                id: 9,
                label: 'Secret block',
                desc: 'This is a secret block (they work in pair)',
                tiles: 'fcnews',
                offset: false
            },
            {
                id: 10,
                label: 'Transparent block',
                desc: 'This is a transparent block : It is not walkable, but you can build windows with this because rays will pass through it.',
                tiles: 'fcnews',
                offset: true
            },
            {
                id: 11,
                label: 'Invisible block',
                desc: 'This is an invisible block : It is not walkable',
                tiles: 'fc',
                offset: false
            },
            {
                id: 12,
                label: 'Offset block',
                desc: 'This block is like a solid block, with an offset',
                tiles: 'fcnews',
                offset: true
            },
        ],


        loops: [
            {
                id: 0,
                label: 'None',
                desc: 'No animation at all'
            },
            {
                id: 1,
                label: 'Forward',
                desc: 'Forward animation only'
            },
            {
                id: 2,
                label: 'Yoyo',
                desc: 'Forward and backward animation'
            }
        ]
    },




    models: {

        blockBrowser: {
            selected: null
        },

        thingBrowser: {
            selected: null
        },

        tileBrowser: {
            type: 'wall'
        },

        levelGrid: {
            selectedRegion: {
                x1: -1,
                y1: -1,
                x2: -1,
                y2: -1
            },
            selectedThing: {
                xc: -1,
                yc: -1,
                xt: -1,
                yt: -1
            },
            undo: [],
            hltags: [],
            selectedTool: 0
        },

        tagManager: {}
    },

    somethingHasChanged: false,
    levelData: null, // last generated level data
    levelName: '',
    levelList: [],
    statusBar: {
        content: 'Welcome to Raycaster Map Editor',
        color: '#000'
    },

    popup: {
        visible: false,
        content: '',
        type: 'simple', // simple, progress, error
        progress: 0 // 0 -> 1
    }
};