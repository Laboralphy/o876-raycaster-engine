import GameAbstract from '../../lib/src/GameAbstract';
import FadeOut from '../../lib/src/engine/filters/FadeOut';
import Halo from '../../lib/src/engine/filters/Halo';
import FadeIn from "../../lib/src/engine/filters/FadeIn";
import Timed from "../../lib/src/engine/filters/Timed";
import Blur from "../../lib/src/engine/filters/Blur";


class Game extends GameAbstract {

}

async function main() {
    const g = new Game();
    await g.run();
    g.engine.filters.link(new Halo('black'));
    const fi = new FadeIn({duration: 500});
    g.engine.filters.link(fi);

    window.addEventListener('keypress', event => {
        if (event.key === 'f') {
            g.engine.filters.link(new FadeIn({color: 'pink', duration: 2000}));
        }
        if (event.key === 'g') {
            g.engine.filters.link(new Timed({duration: 2000, child: new FadeOut({duration: 500})}));
        }
        if (event.key === 'h') {
            g.engine.filters.link(new Timed({duration: 2000, child: new Blur(4)}));
        }
    });
}

window.addEventListener('load', main);
