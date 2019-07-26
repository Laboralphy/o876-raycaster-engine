import GeometryHelper from "../geometry/GeometryHelper";
import * as CONSTS from "./consts";

const {SPRITE_DIRECTION_COUNT} = CONSTS;

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
        let fAngle1 = oEntityLoc.angle + (Math.PI / SPRITE_DIRECTION_COUNT) - fTarget;
        if (fAngle1 < 0) {
            fAngle1 = 2 * Math.PI + fAngle1;
        }
        const nDirection = ((SPRITE_DIRECTION_COUNT * fAngle1 / (2 * Math.PI)) | 0)
            & (SPRITE_DIRECTION_COUNT - 1);
        if (nDirection !== entity.data.backupDirection) {
            entity.data.backupDirection = nDirection;
            entity.sprite.setDirection(nDirection);
        }
    }

    getDeadEntities() {
        return this._entities.filter(e => e.dead);
    }

    get entities() {
        return this._entities;
    }

    process(engine) {
        const entities = this._entities;
        const rc = engine.raycaster;
        for (let i = 0, l = entities.length; i < l; ++i) {
            const e = entities[i];
            const s = e.sprite;
            const eloc = e.location;
            this.updateLookingAngle(e, engine.camera);
            e.think(engine);
            let bChangeLoc = false;
            if (s.x !== eloc.x) {
                s.x = eloc.x;
                bChangeLoc = true;
            }
            if (s.y !== eloc.y) {
                s.y = eloc.y;
                bChangeLoc = true;
            }
            if (s.z !== eloc.z) {
                s.h = eloc.z;
                bChangeLoc = true;
            }
            if (bChangeLoc) {
                // update light source
                if (!!e.lightsource) {
                    const ls = e.lightsource;
                    ls.x = eloc.x;
                    ls.y = eloc.y;
                }
            }
            // compute animation from angle
        }
    }
}

export default Horde;