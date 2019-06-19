import UI from '../../lib/src/ui';
import RC from '../../lib/src'
import Interface from './Interface';


function configScreen() {
    const screen = new UI.Screen({
        surface: document.querySelector('div.game canvas.screen'),
        overlay: document.querySelector('div.game div.overlay')
    });
    screen.setup({
        autostretch: true
    });
    return screen;
}


function configEngine(surface) {
    const engine = new RC.Engine();
    engine.setRenderingCanvas(surface);
    return engine;
}


async function loadLevel(overlay, engine, name) {
    overlay.innerHTML = Interface.buildProgressBar();
    const progressBar = overlay.querySelector('progress');

    await engine.loadLevel(name, (phase, progress) => {
        progressBar.setAttribute('value', (progress * 100).toString());
    });
    // starts engine doomloop
    engine.startDoomLoop();

    Interface.clear(overlay);
}


function userSelectLevel(overlay) {
    return new Promise(async resolve => {
        // displays level thumbnail on overlay
        overlay.innerHTML = await Interface.buildLevelSelectionPage();
        const aLevels = overlay.querySelectorAll('.level');
        for (let i = 0, l = aLevels.length; i < l; ++i) {
            // for each level thumbnail...
            const level = aLevels[i];
            const name = level.getAttribute('data-level');
            // ... attach click event listenner
            level.addEventListener('click', () => {
                // remove level selection page from overlay
                Interface.clear(overlay);
                // and resolve promise
                resolve(name);
            });
        }
    });
}


/**
 * Screen and overlay initialization.
 * Will imbue specified canvas with auto-stretch capabilities.
 */
async function main() {
    const screen = configScreen();
    const engine = configEngine(screen.surface);
    const level = await userSelectLevel(screen.overlay);
    window.addEventListener('keydown', event => {
        if (!!engine && !!engine.camera) {
            engine.camera.thinker.keyDown(event.key)
        }
    });
    window.addEventListener('keyup', event => {
        if (!!engine && !!engine.camera) {
            engine.camera.thinker.keyUp(event.key)
        }
    });
    await loadLevel(screen.overlay, engine, level);
}

window.addEventListener('load', main);


