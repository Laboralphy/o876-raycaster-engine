import GeometryHelper from "../geometry/GeometryHelper";
import * as CONSTS from "./consts";

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


    /**
     * This will change the animation according to the angle between entity.location.angle and camera.location.angle
     */
    updateLookingAngle(entity, camera) {
        if (entity === camera) {
            return;
        }
        const oEntityLoc = entity.location;
        const oCameraLoc = camera.location;
        const fTarget = GeometryHelper.angle(oCameraLoc.x, oCameraLoc.y, oEntityLoc.x, oEntityLoc.y);
        // backup
        if (entity.data.backupLookingAngle !== fTarget) {
            entity.data.backupLookingAngle = fTarget;
            let fAngle1 = oEntityLoc.angle + (Math.PI / CONSTS.SPRITE_DIRECTION_COUNT) - fTarget;
            if (fAngle1 < 0) {
                fAngle1 = 2 * Math.PI + fAngle1;
            }
            entity.sprite.setDirection(
                ((CONSTS.SPRITE_DIRECTION_COUNT * fAngle1 / (2 * Math.PI)) | 0)
                & (CONSTS.SPRITE_DIRECTION_COUNT - 1)
            );
        }
    }

    process(engine) {
        const entities = this._entities;
        for (let i = 0, l = entities.length; i < l; ++i) {
            const e = entities[i];
            const s = e.sprite;
            const eloc = e.location;
            this.updateLookingAngle(e, engine.camera);
            e.think(engine);
            s.x = eloc.x;
            s.y = eloc.y;
            s.h = eloc.z;
            // compute animation from angle
        }
    }
}

export default Horde;