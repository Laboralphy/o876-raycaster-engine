class DataBuilder {
    static buildWraithBlueprints(aWraiths) {
        return aWraiths.map(w => ({
            "id": w,
            "ref": w,
            "tileset": w,
            "scale": 3,
            "thinker": "WraithThinker",
            "size": 16,
            "fx": ["@FX_LIGHT_ADD", "@FX_LIGHT_SOURCE"],
            "data": {
                "type": "w"
            }
        }))
    }

    static buildGhostBlueprints(aGhosts, data) {
        return aGhosts
            .map(id => {
                console.log(data)
                return data.find(d => d.id == id);
            })
            .map(({id, thinker, speed, vitality, power, score, level, missile, soundset}) => ({
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
                level,
                missile,
                soundset
            }
        }));
    }
}

export default DataBuilder;
