export default {
    player: {
        inventory: {
            questItems: []
        },
        attributes: {
            hp: 40,
            hpMax: 100
        }
    },

    camera: {
        energy: {
            value: 0,
            maximum: 100,
            rate: 1,
            depleteRate: 0.7
        },
        power: 100,
        width: 0,
        captureRadius: 1,
        lastShotTime: 0,
        sensor: {
            supernatural: false,
            lamp: 0
        }
    },

    supernatural: {
        beacons: []
    },

    data: {
        items: [],
        itemTypes: ['all', 'quest', 'book']
    }
};