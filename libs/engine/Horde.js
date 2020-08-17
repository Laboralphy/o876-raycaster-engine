import Geometry from "../geometry";
import * as CONSTS from "./consts";
import ArrayHelper from "../array-helper";
import SectorRegistry from "../sector-registry/SectorRegistry";

const {SPRITE_DIRECTION_COUNT} = CONSTS;

class Horde {
    constructor() {
        this._entities = [];
        this._sectors = new SectorRegistry();
    }

    setMapSize(w) {
        this
            ._sectors
            .grid
            .setWidth(w)
            .setHeight(w);
    }

    setSectorSize(n) {
        this
            ._sectors
            .setCellWidth(n)
            .setCellHeight(n);
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
        entity._sector.remove(entity);
        entity._sector = null;
        const aEntities = this._entities;
        const iEntity = aEntities.indexOf(entity);
        if (iEntity >= 0) {
            aEntities.splice(iEntity, 1);
        }
    }


    /**
     * This will change the animation according to the angle between entity.position.angle and camera.position.angle
     */
    updateLookingAngle(entity, camera) {
        if (entity === camera) {
            return;
        }
        const oEntityLoc = entity.position;
        const oCameraLoc = camera.position;
        const fTarget = Geometry.angle(oCameraLoc.x, oCameraLoc.y, oEntityLoc.x, oEntityLoc.y);
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
        const sr = this._sectors;
        const ps = sr.getCellWidth();
        for (let i = 0, l = entities.length; i < l; ++i) {
            const e = entities[i];
            const s = e.sprite;
            const bHasSprite = !!s;
            const eloc = e.position;
            this.updateLookingAngle(e, engine.camera);
            e.think(engine);
            let bChangeLoc = false;
            if (bHasSprite) {
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
            }
            // si le sprite a changé de position ou si c'est la camera
            // mettre a jou les autre donnée de position
            // (lumière, secteur)
            if (bChangeLoc || !bHasSprite) {
                // update light source
                if (!!e.lightsource) {
                    const ls = e.lightsource;
                    ls.x = eloc.x;
                    ls.y = eloc.y;
                }

                // update grid sector
                // get the sector coords
                const xSector = eloc.x / ps | 0;
                const ySector = eloc.y / ps | 0;
                const eds = e._sector;
                if (!!eds) {
                    eds.remove(e);
                }
                const sector = sr.sector(xSector, ySector);
                e._sector = sector;
                sector.add(e);
            }
            // compute animation from angle
        }
    }

    /**
     * Get a list of entities at specified sector
     * @param xSector {number}
     * @param ySector {number}
     * @return {Array}
     */
    getEntitiesAt(xSector, ySector) {
        const g = this._sectors;
        const nSize = g.grid.getWidth();
        if (xSector > 0 && ySector > 0 && xSector < nSize && ySector < nSize) {
            return g.sector(xSector, ySector).objects;
        } else {
            return [];
        }
    }
}

export default Horde;