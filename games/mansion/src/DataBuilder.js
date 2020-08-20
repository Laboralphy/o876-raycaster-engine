class DataBuilder {
    static buildWraithBlueprints(aWraiths) {
        return aWraiths.map(w => ({
            "id": w.id,
            "ref": w.id,
            "tileset": w.id,
            "scale": 3,
            "thinker": "WraithThinker",
            "size": 16,
            "fx": ["@FX_LIGHT_ADD", "@FX_LIGHT_SOURCE"],
            "data": {
                "type": "w"
            }
        }))
    }

    static buildGhostBlueprints(aGhosts) {
        return aGhosts.map(({id, thinker, speed, vitality, power, score, level}) => ({
            id,
            ref: id,
            tileset: id,
            scale: 3,
            thinker: thinker + 'Thinker',
            size: 16,
            fx: ["@FX_LIGHT_ADD", "@FX_LIGHT_SOURCE"],
            data: {
                type: "v",
                speed,
                vitality,
                power,
                score,
                level
            }
        }));
    }
}

export default DataBuilder;
