/**
 * PointerLock
 *
 * @description This class provides control over the Pointer Lock API.
 * Typically an HTML Element (usually a canvas) is designed to lock the mouse pointer.
 * While mouse pointer is locked, it remains invisible. If the user move the mouse, events describing
 * mouse movements are triggered at high frequency. This is ideal for FPS game where the mouse is used
 * to control the player's point of vue (camera angle).
 *
 * @author Raphaël Marandet
 * @email raphael.marandet(at)gmail(dot)com
 * @date 2019-06-13
 */

const Events = require('events');

class PointerLock {

    constructor() {
        this.oElement = null;
        this.bInitialized = null;
        this.bLocked = false;
        this.bEnabled = true;
        this._events = new Events();
    }

    /**
     * getter for the events property
     * @returns {module:events.internal}
     */
    get events() {
        return this._events;
    }

    /**
     * returns true if PointerLock API is available on this browser
     * @returns {boolean}
     */
    hasPointerLockFeature() {
        return 'pointerLockElement' in document || 'mozPointerLockElement' in document;
    }

    /**
     * Design an element to be the mouse pointer locker. If the operation succeed, the mouse pointer
     * is locked and mouse movements are now converted into a serie of delta-movements
     * @param oElement {HTMLElement}
     */
    enable(oElement) {
        if (!this.bEnabled) {
            this.bEnabled = true;
            if (oElement) {
                this.requestPointerLock(oElement);
            }
        }
    }

    /**
     * Disable the pointer locking process. The mouse cursor becomes visible again, and works normally.
     */
    disable() {
        if (this.bEnabled) {
            this.bEnabled = false;
            this.exitPointerLock();
        }
    }

    /**
     * PointerLock API initialisation.
     * Initialization of event handler to observe PointerLock change of state.
     * @returns {boolean} returns true if PointerLock initialization is successfull
     */
    init() {
        if (!this.hasPointerLockFeature()) {
            return false;
        }
        if (this.bInitialized) {
            return true;
        }
        document.addEventListener('pointerlockchange', event => this.eventChange(event), false);
        document.addEventListener('mozpointerlockchange', event => this.eventChange(event), false);
        document.addEventListener('pointerlockerror', event => this.eventError(event), false);
        document.addEventListener('mozpointerlockerror', event => this.eventError(event), false);
        this.bInitialized = true;
        return true;
    }

    /**
     * Returns true if the mouse pointer is locked
     * @returns {boolean}
     */
    locked() {
        return this.bLocked;
    }

    /**
     * Requests the browser to lock the mouse pointer at the center of the specified HTML Element
     * @param oElement {HTMLElement}
     */
    requestPointerLock(oElement) {
        if (!this.bEnabled) {
            return;
        }
        if (this.locked()) {
            return;
        }
        this.oElement = oElement;
        oElement.requestPointerLock = oElement.requestPointerLock || oElement.mozRequestPointerLockWithKeys || oElement.mozRequestPointerLock;
        oElement.requestPointerLock();
    }

    /**
     * Requests the browser to release mouse pointer
     */
    exitPointerLock() {
        if (!this.locked()) {
            return;
        }
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
        document.exitPointerLock();
    }

    /**
     * Emits an event
     * @param sEvent {string}
     * @param payload {*}
     */
    trigger(sEvent, payload = undefined) {
        this._events.emit(sEvent, payload);
    }

    /**
     * This is the Change event handler. Called when something changed concerning the pointer locking process.
     * These events are dealt with :
     * 1) we are entering PointerLock mode (because we requested to, with the requestPointerLock function)
     * 2) we are exiting PointerLock mode (because we requested to, with the exitPointerLock function)
     * @param event {Event}
     */
    eventChange(event) {
        let oPointerLockElement = document.pointerLockElement || document.mozPointerLockElement;
        if (oPointerLockElement) {
            document.addEventListener('mousemove', this.eventMouseMove, false);
            this.bLocked = true;
            this.trigger('enter');
        } else {
            document.removeEventListener('mousemove', this.eventMouseMove, false);
            this.oElement = null;
            this.bLocked = false;
            this.trigger('exit');
        }
    }

    /**
     * This handler deals with error
     * @param event {Event}
     */
    eventError(event) {
        console.error('PointerLock error', event);
        this.trigger('error', {error: event});
    }

    /**
     * This handler deals with mouse movement, tranforming them, transmitting them to client application
     * @param event {Event}
     */
    eventMouseMove(event) {
        const x = e.movementX || e.mozMovementX || 0;
        const y = e.movementY || e.mozMovementY || 0;
        this.trigger('mousemove', {x, y});
    }
}

export default PointerLock;