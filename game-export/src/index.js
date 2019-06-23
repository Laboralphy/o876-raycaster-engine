import GameAbstract from '../../lib/src/GameAbstract';
import FadeOut from '../../lib/src/engine/filters/FadeOut';
import Gradient from '../../lib/src/engine/filters/Gradient';
import DarkHalo from '../../lib/src/engine/filters/DarkHalo'


class Game extends GameAbstract {

}

function main() {
    const g = new Game();
    g.run();

    window.addEventListener('keypress', event => {
        if (event.key === 'f') {
            g.engine.filters.link(new DarkHalo());
        }
    });
}

window.addEventListener('load', main);
