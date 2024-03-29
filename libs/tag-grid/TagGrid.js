/**
 * @class TagGrid
 * this class manages a grid, each cell has a list of tags (string)
 * you can add, remove tag to/from cells
 * you can "visit" each cell of the grid, the tag list of the cell you are currently on, will change, and you will be warned when so.
 */

import Grid from "@laboralphy/grid";
import Painting from "../painting";
import quoteSplit from "../quote-split";

const SERIAL_VERSION = 1;

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

    get state() {
        const oState = {
            version: SERIAL_VERSION,
            id: this._id,
            factory: Object.assign({}, this._tagFactory),
            cells: [],
            width: this.width,
            height: this.height
        };

        this.iterate((x, y, value) => {
            if (value.size) {
                oState
                    .cells
                    .push({x, y, tags: [...value]});
            }
        });

        return oState;
    }

    set state(oState) {
        if (oState.version !== SERIAL_VERSION) {
            throw new Error('bad serialization version - class TagGrid - expected v' + SERIAL_VERSION + ' - got v' + oState.version);
        }
        this.width = oState.width;
        this.height = oState.height;
        oState.cells.forEach(({x, y, tags}) => {
            const aSet = this.cell(x, y);
            tags.forEach(x => aSet.add(x));
        });
        this._id = oState.id;
        this._tagFactory = Object.assign({}, oState.factory);
        this._tagFactoryInv = {};
        for (let s in oState.factory) {
            this._tagFactoryInv[oState.factory[s].toString()] = s;
        }
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


    getCellTags(x, y) {
        const aTagIds = this.cell(x, y);
        const aTags = [];
        aTagIds.forEach(id => aTags.push({id, x, y, tag: this.getTagCommand(id)}));
        return aTags;
    }

    /**
     * returns the tag maching the specified id
     * @param id {number}
     * @return {string}
     */
    getTag(id) {
        return this._tagFactoryInv[id];
    }

    /**
     * returns the quote-split tag maching the specified id
     * @param id {number}
     * @return {string[]}
     */
    getTagCommand(id) {
        return quoteSplit(this.getTag(id))
    }

    /**
     * remove a specified tag in the cell
     * @param x {number} coordinate of cell (x-axis), which may contain the tag
     * @param y {number} coordinate of cell (y-axis), which may contain the tag
     * @param id {number} tag identifier within the cell
     * @return {boolean} true = a tag has been delete (given id was found); false = no tag with given id has been found, nothing deleted
     */
    removeTag(x, y, id) {
        const tags = this.cell(x, y);
        if (tags.has(id)) {
            tags.delete(id);
            return true;
        } else {
            return false;
        }
    }

    /**
     * removes all contiguous tags starting from a specified position
     * @param x
     * @param y
     * @param id
     */
    removeTagRegion(x, y, id) {
        Painting.paint(x, y, (xCell, yCell) => this.removeTag(xCell, yCell, id));
    }

    /**
     * enumerates all tag changes between two position
     * @param xFormer {number} former position (x axis)
     * @param yFormer {number} former position (y axis)
     * @param xLater {number} later position (x axis)
     * @param yLater {number} later position (y axis)
     */
    visit(xFormer, yFormer, xLater, yLater) {
        if (xFormer === xLater && yFormer === yLater) {
            return false;
        }
        const formerTags = this.cell(xFormer, yFormer) || new Set();
        const laterTags = this.cell(xLater, yLater) || new Set();
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
