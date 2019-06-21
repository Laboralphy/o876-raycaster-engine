import GameAbstract from '../../lib/src/GameAbstract';

class Game extends GameAbstract {

}

function main() {
    const g = new Game();
    g.run();
}

window.addEventListener('load', main);


