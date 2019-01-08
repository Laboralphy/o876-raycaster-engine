class Horde {
    constructor() {
        this._entities = [];
    }


    /**
     * checks if an entity is linked into the engine.
     * only linked entities are thinked and rendered
     * @param entity {Entity}
     * @returns {boolean}
     */
    isEntityLinked(entity) {
        return this._entities.indexOf(entity) >= 0;
    }

    /**
     * Add an entity into the engine
     * only linked entities are thinked and rendered
     * @param entity {Entity}
     */
    linkEntity(entity) {
        if (!this.isEntityLinked(entity)) {
            this._entities.push(entity);
        }
    }

    /**
     * Remove an entity from the engine
     * only linked entities are thinked and rendered
     * @param entity {Entity}
     */
    unlinkEntity(entity) {
        const aEntities = this._entities;
        const iEntity = aEntities.indexOf(entity);
        if (iEntity >= 0) {
            aEntities.splice(iEntity, 1);
        }
    }

    process(engine) {
        const entities = this._entities;
        for (let i = 0, l = entities.length; i < l; ++i) {
            const e = entities[i];
            const s = e.sprite;
            const eloc = e.location;
            e.think(engine);
            s.x = eloc.x;
            s.y = eloc.y;
            s.h = eloc.z;
            // compute animation from angle
        }
    }
}

export default Horde;