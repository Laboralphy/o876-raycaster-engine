function setupPointerlock() {
    var PL = MAIN.pointerlock = new O876_Raycaster.PointerLock();
    if (MAIN.config.game.fpsControl && PL.init()) {
        MAIN.screen.addEventListener('click', function(oEvent) {
            MAIN.lockPointer();
        });
    }
}

/**
 * Entre en mode pointerlock
 * @param oElement
 * @returns {Boolean}
 */
function lockPointer() {
    var G = MAIN.game;
    var rc = G.oRaycaster;
    var oElement = MAIN.screen; // précédemment : rc.getScreenCanvas();
    var rcc = rc.oCamera;
    var rcct = rcc.oThinker;
    if (!rcc || !rcct) {
        return false;
    }
    if (MAIN.pointerlock.locked()) {
        return false;
    }
    if (MAIN.config.game.fullScreen) {
        O876_Raycaster.FullScreen.changeEvent = function(e) {
            if (O876_Raycaster.FullScreen.isFullScreen()) {
                MAIN.pointerlock.requestPointerLock(oElement);
                //MAIN.pointerlock.on('mousemove', G.oRaycaster.oCamera.oThinker.readMouseMovement.bind(G.oRaycaster.oCamera.oThinker));
            }
        };
        O876_Raycaster.FullScreen.enter(oElement);
    } else {
        MAIN.pointerlock.requestPointerLock(oElement);
        //MAIN.pointerlock.on('mousemove', rcct.readMouseMovement.bind(rcct));
    }
    return true;
}

