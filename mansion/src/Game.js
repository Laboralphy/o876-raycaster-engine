import GameAbstract from '../../lib/src/game-abstract';
import {quoteSplit} from "../../lib/src/quote-split";
import UI from './UI';
import Logic from './Logic';
import Scripts from './scripts';

class Game extends GameAbstract {
    // ... write your game here ...
    init() {
        super.init();
        this._ui = new UI();
        this._logic = new Logic(this._ui.store);
        this.logic.loadData();
    }

    get ui() {
        return this._ui;
    }

    get logic() {
        return this._logic;
    }

    enterLevel() {
        super.enterLevel();
        this.initTagHandlers();
    }

//  _                _                   _        _   _
// | | _____   _____| |  _ __ ___  _   _| |_ __ _| |_(_) ___  _ __  ___
// | |/ _ \ \ / / _ \ | | '_ ` _ \| | | | __/ _` | __| |/ _ \| '_ \/ __|
// | |  __/\ V /  __/ | | | | | | | |_| | || (_| | |_| | (_) | | | \__ \
// |_|\___| \_/ \___|_| |_| |_| |_|\__,_|\__\__,_|\__|_|\___/|_| |_|___/


    /**
     * Remove all decals from a block
     * @param x {number} block cell coordinate (x axis)
     * @param y {number} block cell coordinate (y axis)
     */
    removeDecals(x, y) {
        const csm = this.engine.raycaster._csm;
        for (let i = 0; i < 4; ++i) {
            csm.removeDecal(x, y, i);
        }
    }

    /**
     * Rotates all decals on a block
     * @param x {number} block cell coordinate (x axis)
     * @param y {number} block cell coordinate (y axis)
     * @param bClockWise {boolean} true = clock wise ; false = counter clock wise (default)
     */
    rotateDecals(x, y, bClockWise) {
        const csm = this.engine.raycaster._csm;
        csm.rotateWallSurfaces(x, y, !bClockWise);
    }

    /**
     * Adds a tag on a cell
     * @param x {number} cell coordinate (x axis)
     * @param y {number} cell coordinate (y axis)
     * @param sTag {string} complete tag (one string)
     * @return {number} tag identifier (for modification)
     */
    addTag(x, y, sTag) {
        return this.engine._tm._tg.addTag(x, y, sTag);
    }



//  _                                           _   _
// | |_ __ _  __ _    ___  _ __   ___ _ __ __ _| |_(_) ___  _ __  ___
// | __/ _` |/ _` |  / _ \| '_ \ / _ \ '__/ _` | __| |/ _ \| '_ \/ __|
// | || (_| | (_| | | (_) | |_) |  __/ | | (_| | |_| | (_) | | | \__ \
//  \__\__,_|\__, |  \___/| .__/ \___|_|  \__,_|\__|_|\___/|_| |_|___/
//           |___/        |_|
    /**
     * Returns a list of all tags present on the maps, the returns list contains items with these properties :
     * {
     *     x, y, // cell coordinates
     *     tags,  // tag components (space separated values)
     * }
     * @return {array<{tag, x, y}>}
     */
    getTags() {
        const aTags = []; // output list
        const tg = this.engine._tm._tg; // get the tag grid
        tg.iterate((x, y, cell) => { // iterates all cells of the tag grid
            cell.forEach(t => aTags.push({
                x, y,
                tag: quoteSplit(tg.getTag(t))
            }));
        });
        return aTags;
    }

    /**
     * Processes tag initial behavior.
     * Some tags may trigger initial behavior right after level loading.
     * For example, the "lock" tag must trigger a lockDoor() call.
     *
     * Also initialize tag handlers for all tags.
     *
     * the "scripts" folder contains many scripts, each script matches to a set of events.
     * when the event is trigger the matching script is run.
     *
     * example .
     * when 'tag.item.push' is triggered, the script "item" is loaded and the function "item.push()" is called.
     */
    initTagHandlers() {
        this.getTags().forEach(({tag, x, y}) => {
            const s = tag[0];
            if (s in Scripts) {
                const script = Scripts[s];
                if ('init' in script) {
                    let bRemove = false;
                    const pRemove = function () {
                        bRemove = true;
                    };
                    script.init(this, pRemove, x, y)
                }
            }
        });
        const ee = this.engine.events;
        const actions = ['push', 'enter', 'exit'];
        for (let s in Scripts) {
            const script = Scripts[s];
            actions.forEach(a => {
                if (a in script) {
                    ee.on('tag.' + s + '.' + a,({x, y, parameters, remove}) => script[a](this, remove, x, y, ...parameters));
                }
            });
        }
    }
}

export default Game;