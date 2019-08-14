import GameAbstract from '../../lib/src/game-abstract';
import {quoteSplit} from "../../lib/src/quote-split";
import ui from './ui';
import * as MUTATIONS from './ui/store/mutation-types';

class Game extends GameAbstract {
    // ... write your game here ...

    enterLevel() {
        super.enterLevel();
        this.processTags();
        this.initTagHandlers();
    }



//                              _                   _                                   _        _   _
//  _ __ ___   __ _ _ __  _ __ (_)_ __   __ _   ___| |_ ___  _ __ ___   _ __ ___  _   _| |_ __ _| |_(_) ___  _ __  ___
// | '_ ` _ \ / _` | '_ \| '_ \| | '_ \ / _` | / __| __/ _ \| '__/ _ \ | '_ ` _ \| | | | __/ _` | __| |/ _ \| '_ \/ __|
// | | | | | | (_| | |_) | |_) | | | | | (_| | \__ \ || (_) | | |  __/ | | | | | | |_| | || (_| | |_| | (_) | | | \__ \
// |_| |_| |_|\__,_| .__/| .__/|_|_| |_|\__, | |___/\__\___/|_|  \___| |_| |_| |_|\__,_|\__\__,_|\__|_|\___/|_| |_|___/
//                 |_|   |_|            |___/


    popup(text, icon = '') {
        ui.mutate(MUTATIONS.ADD_POPUP_TEXT, {text, icon, time: this.engine.getTime() + 2000});
    }





//  _                                           _   _
// | |_ __ _  __ _    ___  _ __   ___ _ __ __ _| |_(_) ___  _ __  ___
// | __/ _` |/ _` |  / _ \| '_ \ / _ \ '__/ _` | __| |/ _ \| '_ \/ __|
// | || (_| | (_| | | (_) | |_) |  __/ | | (_| | |_| | (_) | | | \__ \
//  \__\__,_|\__, |  \___/| .__/ \___|_|  \__,_|\__|_|\___/|_| |_|___/
//           |___/        |_|


    /**
     * Initialize tag handlers
     */
    initTagHandlers() {
        this.engine.events.on('door.locked', ({x, y}) => this.tagEventLock(x, y));
    }

    tagEventLock(x, y) {
        this.popup('This door is locked');
    }

    /**
     * Processes tag initial behavior.
     * Some tags may trigger initial behavior right after level loading.
     * For example, the "lock" tag must trigger a lockDoor() call.
     */
    processTags() {
        this.getTags().forEach(({tag, x, y}) => {
            switch (tag[0]) {
                case 'lock':
                    this.tagInitLock(x, y);
                    break;
            }
        });
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