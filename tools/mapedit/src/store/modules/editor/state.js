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
        blockBuilder: {
            id: null,
            ref: '',
            phys: 0,
            offs: 0,
            light: {
                enabled: false,
                value: 0.6,
                inner: 0,
                outer: 150
            },
            faces: {
                n: null,
                e: null,
                w: null,
                s: null,
                f: null,
                c: null
            }
        },

        animationBuilder: {
            start: 0,
            frames: 2,
            duration: 80,
            loop: 0
        }
    }
};