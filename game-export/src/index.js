import GameAbstract from '../../lib/src/GameAbstract';
import FadeOut from '../../lib/src/engine/filters/FadeOut';

class Game extends GameAbstract {

}

function main() {
    const g = new Game();
    g.run();

    window.addEventListener('keypress', event => {
        if (event.key === 'f') {
            const fi = new FadeOut({
                color: '#036',
                duration: 500
            });
            g.engine.filters.link(fi);
        }
    });
}

window.addEventListener('load', main);
