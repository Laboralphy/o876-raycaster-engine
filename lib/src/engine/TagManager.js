import TagGrid from "../tag-grid";
import {quoteSplit} from "../quote-split";
import Events from "events";

class TagManager {
    constructor() {
        this._tg = new TagGrid();
        this._events = new Events();
    }

    addTag(x, y, tag) {
        this._tg.addTag(x, y, tag);
    }

    setMapSize(n) {
        this._tg.setWidth(n);
        this._tg.setHeight(n);
    }

    _checkEntityContext(entity) {
        const d = entity.data;
        if (!d.tagman) {
            d.tagman = {
                xSector: -1,
                ySector: -1
            };
        }
    }

    get events() {
        return this._events;
    }

    hordeProcess(engine) {
        const tg = this._tg;
        const ps = engine.raycaster.options.metrics.spacing;
        const process = e => {
            this._checkEntityContext(e);
            const dtm = e.data.tagman;
            const xSector = e.location.x / ps | 0;
            const ySector = e.location.y / ps | 0;
            const v = tg.visit(dtm.xSector, dtm.ySector, xSector, ySector);
            if (v !== false) {
                v.old.forEach(id => this.emitEvent(id, 'tagleave', tg.getTag(id), e, dtm.xSector, dtm.xSector));
                v.new.forEach(id => this.emitEvent(id, 'tagenter', tg.getTag(id), e, xSector, ySector));
            }
            dtm.xSector = xSector;
            dtm.ySector = ySector;
        };
        process(engine.camera);
        engine.horde.entities.forEach(e => process(e));
    }

    /**
     * Si le secteur spécifié contient un tag : le déclencher
     * @param entity
     * @param xSector
     * @param ySector
     */
    entityPushBlock(entity, xSector, ySector) {
        const tg = this._tg;
        const tags = tg.cell(xSector, ySector);
        if (!!tags) {
            tags.forEach(id => this.emitEvent(id, 'tagpush', tg.getTag(id), entity, xSector, ySector));
        }
    }

    tagParse(sTag) {
        const parameters = quoteSplit(sTag);
        const command = parameters.shift();
        return {
            command,
            parameters
        }
    }

    emitEvent(id, sType, sTag, entity, x, y) {
        const tg = this._tg;
        const event = {
            entity,
            x, y,
            ...this.tagParse(sTag),
            remove: () => tg.removeTagRegion(x, y, id)
        };

        this._events.emit(sType, event);
    }
}

export default TagManager;