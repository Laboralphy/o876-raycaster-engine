import * as TYPES from './mutation-types';

export default {
    /**
     * Increase visor charged energy
     * @param state
     */
    [TYPES.INC_ENERGY]: function(state, {amount}) {
        const e = state.energy;
        e.rate = amount;
        e.value = Math.min(e.maximum, e.value + e.rate);
    },

    /**
     * Decrease visor charged energy
     * @param state
     */
    [TYPES.DEC_ENERGY]: function(state) {
        const e = state.energy;
        e.value = Math.max(0, e.value - e.depleteRate);
    },

    /**
     * Deplete charged energy : set energy to 0
     * @param state
     */
    [TYPES.DEPLETE_ENERGY]: function(state) {
        state.energy.value = 0;
    },

    [TYPES.SHOOT]: function(state, {time}) {
        state.lastShotTime = time;
    },

    [TYPES.SET_CAMERA_WIDTH]: function(state, {value}) {
        state.width = value;
    },

    [TYPES.AIMING_SUPERNATURAL]: function(state, {value}) {
        state.sensor.supernatural = value;
    },

    [TYPES.SET_CAMERA_LAMP]: function(state, {value}) {
        state.sensor.lamp.intensity.aim = value;
    }
}