import GameAbstract from '../../lib/src/game-abstract';

class Game extends GameAbstract {
    // ... write your game here ...

    init() {
        super.init();

        // listen to events
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