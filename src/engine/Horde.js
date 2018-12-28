class Horde {
    constructor() {
        this._entities = [];
    }


    linkEntity(e) {
        this._entities.push(e);
    }

    process() {
        const entities = this._entities;
        for (let i = 0, l = entities.length; i < l; ++i) {
            const e = entities[i];
            e.think();
        }
    }
}