import {VERSION} from './version';
import Game from './Game';
import config from './config';

async function main() {
    console.info('MANSION Project version', VERSION);
    const g = new Game();
    g.config(config);
    await g.run();
    window.GAME = g;
}

window.addEventListener('load', main);