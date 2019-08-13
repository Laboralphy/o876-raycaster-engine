import GameAbstract from '../../lib/src/game-abstract';
import {quoteSplit} from "../../lib/src/quote-split";

class Game extends GameAbstract {
    // ... write your game here ...

    enterLevel() {
        super.enterLevel();
        console.log(this.getTags());
        this.engine.events.on('tag.bgm.enter', (...args) => console.log('tag event bgm enter', ...args));
    }

    /**
     * Returns a list of all tags present on the maps
     * the list contains items with these properties :
     * {
     *     x, y, // cell coordinates
     *     tags,  // tags
     * }
     * @return {array}
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