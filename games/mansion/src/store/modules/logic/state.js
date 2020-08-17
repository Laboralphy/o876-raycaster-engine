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
            power: 100,
            depleteRate: 0.7
        },
        captureRadius: 1,
        lastShotTime: 0,
        sensor: {

        }
    },

    data: {
        items: [],
        itemTypes: ['all', 'quest', 'book']
    }
};