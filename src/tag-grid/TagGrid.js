// a grid of tags

import crypto from "crypto";

import Grid from "../grid";
import ArrayHelper from "../array-helper";

class TagGrid extends Grid {

    constructor() {
        super();
        this.on('rebuild', (data) => {
            data.cell = new Set();
        });
        this._tagFactory = {};
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
        } else {
            // new tag : get an id
            id = this._tagFactory[sTag] = ++this._id;
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

    removeTag(x, y, id) {
        const tags = this.cell(x, y);
        tags.delete(id);
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
        const formerTags = this.cell(xFormer, yFormer);
        const laterTags = this.cell(xLater, yLater);
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