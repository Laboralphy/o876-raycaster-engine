// a grid of tags

import Grid from "../grid";
import Painting from "../painting";

class TagGrid extends Grid {

    constructor() {
        super();
        this.on('rebuild', (data) => {
            data.cell = new Set();
        });
        this._tagFactory = {};
        this._tagFactoryInv = {};
        this._id = 0;
    }

    /**
     * adds a new tag on the specified cell
     * @param x {number} cell coordinates (x axis)
     * @param y {number} cell coordinates (y axis)
     * @param sTag {string} tag
     */
    addTag(x, y, sTag) {
        const tags = this.cell(x, y);
        let id;
        // lets get this tag's id
        if (sTag in this._tagFactory) {
            // already known tag
            id = this._tagFactory[sTag];
            this._tagFactoryInv[id] = sTag;
        } else {
            // new tag : get an id
            id = this._tagFactory[sTag] = ++this._id;
            this._tagFactoryInv[id] = sTag;
        }
        // check if the id is present
        if (tags.has(id)) {
            // nothing to do : returns the id
            return id;
        }
        // tag must be added
        tags.add(id);
        return id;
    }

    /**
     * returns the ttag maching the specified id
     * @param id {number}
     * @return {string}
     */
    getTag(id) {
        return this._tagFactoryInv[id];
    }

    /**
     * remove a specified tag in the cell
     * @param x
     * @param y
     * @param id
     */
    removeTag(x, y, id) {
        const tags = this.cell(x, y);
        tags.delete(id);
    }

    /**
     * removes all contiguous tags starting from a specified position
     * @param x
     * @param y
     * @param id
     */
    removeTagRegion(x, y, id) {
        Painting.paint(x, y, (xCell, yCell) => {
            const tags = this.cell(xCell, yCell);
            if (tags.has(id)) {
                tags.delete(id);
                return true;
            } else {
                return false;
            }
        });
    }

    /**
     * enumerates all tag changes between two location
     * @param xFormer {number} former location (x axis)
     * @param yFormer {number} former location (y axis)
     * @param xLater {number} later location (x axis)
     * @param yLater {number} later location (y axis)
     */
    visit(xFormer, yFormer, xLater, yLater) {
        if (xFormer === xLater && yFormer === yLater) {
            return false;
        }
        const formerTags = this.cell(xFormer, yFormer) || new Set();
        const laterTags = this.cell(xLater, yLater) || new Set();
        // in formerTags, not in laterTags
        const xOld = new Set([...formerTags].filter(x => !laterTags.has(x)));
        const xNew = new Set([...laterTags].filter(x => !formerTags.has(x)));
        return {
            'new': xNew,
            'old': xOld
        };
    }
}

export default TagGrid;