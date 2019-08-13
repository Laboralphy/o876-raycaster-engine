import GameAbstract from '../../lib/src/game-abstract';

class Game extends GameAbstract {
    // ... write your game here ...

    constructor() {
        super();
        this.on('initialized', () => {
            this.getLevelTags();
        });
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
    getLevelTags() {
        this.engine._tm._tg.iterate((x, y, cell) => {
            console.log(x, y, cell);
        })
    }
}

export default Game;