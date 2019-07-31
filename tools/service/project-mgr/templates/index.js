import Game from './Game';
import FadeIn from "../../lib/src/engine/filters/FadeIn";

async function main() {
    const g = new Game();
    await g.run();
    g.engine.filters.link(new FadeIn({duration: 600}));
}

window.addEventListener('load', main);