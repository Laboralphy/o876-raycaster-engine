import GameAbstract from '../../lib/src/game-abstract';
import {quoteSplit} from "../../lib/src/quote-split";
import UI from './UI';
import Logic from './Logic';
import {fetchJSON} from "../../lib/src/fetch-json";

class Game extends GameAbstract {
    // ... write your game here ...
    init() {
        super.init();
        this._ui = new UI();
        this._logic = new Logic(this._ui.store);
        this._logic.loadData();
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


    removeDecals(x, y) {
        const csm = this.engine.raycaster._csm;
        for (let i = 0; i < 4; ++i) {
            csm.removeDecal(x, y, i);
        }
    }


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
     * Processes tag initial behavior.
     * Some tags may trigger initial behavior right after level loading.
     * For example, the "lock" tag must trigger a lockDoor() call.
     *
     * Also initialize tag handlers for all tags.
     */
    initTagHandlers() {
        this.getTags().forEach(({tag, x, y}) => {
            switch (tag[0]) {
                case 'lock':
                    this.tagInitLock(x, y);
                    break;
            }
        });
        this.engine.events.on('tag.item.push', ({x, y, parameters, remove}) => this.tagEventItem(remove, x, y, ...parameters));
        this.engine.events.on('tag.lock.push', ({x, y, parameters, remove}) => this.tagEventLock(remove, x, y, ...parameters));
    }

    tagEventLock(remove, x, y, key) {
        if (this.logic.hasQuestItem(key)) {
            const bDiscard = key.substr(0, 2) === 'k_';
            if (bDiscard) { // the item is a discardable key
                this.logic.removeQuestItem(key); // remove key from inventory
            }
            remove(); // removes tag
            this.ui.popup('DOOR_UNLOCKED', 'unlock', key);
            this.removeDecals(x, y); // remove keyhole decal from door
            this.engine.lockDoor(x, y, false); // unlock door
        } else {
            this.ui.popup('DOOR_LOCKED', 'keyhole');
        }
    }

    tagEventItem(remove, x, y, item) {
        this.ui.popup('ITEM_ACQUIRED', '', item);
        this.removeDecals(x, y);
        this.logic.addQuestItem(item);
        remove();
    }

    /**
     * Initially locks a door tagged with "lock"
     * @param x {number} cell door coordinates (x axis)
     * @param y {number} cell door coordinates (y axis)
     */
    tagInitLock(x, y) {
        this.engine.lockDoor(x, y, true);
    }


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
}

export default Game;