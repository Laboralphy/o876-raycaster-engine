import Game from './Game';
import FadeIn from "../../lib/src/engine/filters/FadeIn";

async function main() {
    const g = new Game();
    await g.run();
    window.GAME = g;
}

window.addEventListener('load', main);