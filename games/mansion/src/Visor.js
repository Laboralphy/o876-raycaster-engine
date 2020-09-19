import * as MUTATIONS from './store/modules/visor/mutation-types';
import StoreAbstract from "./StoreAbstract";
import RangeCollider from "../../../libs/range-collider";
import * as Interpolator from "../../../libs/interpolator";
import * as CONSTS from "./consts";

class Visor extends StoreAbstract {
    constructor(store) {
        super('visor');
        this.store = store;
        this._rcCam = new RangeCollider();
    }

    /**
     * tech : updates visor width, so the ghost score may be correctly computed.
     * @param value
     */
    updateCameraWidth(value) {
        this.commit(MUTATIONS.SET_CAMERA_WIDTH, {value});
    }

    /**
     * Keep a value between 0 and 1
     * @param value {number} input
     * @return {number} output
     * @private
     * @static
     */
    static _min_0_max_1(value) {
        return Math.max(0, Math.min(1, value));
    }

    /**
     *
     * @param value {number} input
     * @param val0 {number} value when output is 0
     * @param val1 {number} value when output is 1
     * @return {number} output
     * @private
     * @static
     */
    static _linear_0_1(value, val0, val1) {
        return Visor._min_0_max_1(Interpolator.linear(value, val0, 0, val1, 1));
    }

    /**
     * Gets how much energy a ghost worth
     * and how many points the ghost photo will score
     * @param entity {Entity}
     * @return {{value, precision, distance}} ghost value from 0 (no value) to 1 (maximum possible value)
     */
    getGhostScore(entity) {
        if (!entity.data.visibility) {
            return {
                entity,
                value: 0,
                precision: 0,
                distance: Infinity,
                proximity: 0
            };
        }
        const {visible, size, offset, distance} = entity.data.visibility;
        if (!visible) {
            return {
                entity,
                value: 0,
                precision: 0,
                distance: Infinity,
                proximity: 0
            };
        }
        // the radius is a factor of CAMERA_CIRCLE_SIZE
        const rcCam = this._rcCam;
        const wCamera = this.prop('getCameraWidth') >> 1;
        const xGhost = offset + (size / 2);
        const radius = wCamera * this.prop('getCameraCaptureRadius') * CONSTS.CAMERA_CIRCLE_SIZE;
        rcCam.setRange(wCamera - radius, wCamera + radius);
        const nInnerEnergy = rcCam.getCenterRelic(offset, offset + size);
        const nOuterEnergy = rcCam.getLeftRelic(offset, offset + size) + rcCam.getRightRelic(offset, offset + size);

        // quelle proportion d'energy à l'intérieur ?
        const bAllInside = nInnerEnergy > 0 && nOuterEnergy === 0;
        // si tout le fantome est dans le cercle de capture : 1 sinon entre 0 et 1
        const fFactor = bAllInside ? 1 : nInnerEnergy / (radius * 2);
        const fPrecision = Visor._linear_0_1(Math.abs(wCamera - xGhost), radius, 0);
        const fProximity = distance < CONSTS.CAMERA_OPTIMAL_DISTANCE
            ? 1
            : Visor._linear_0_1(distance, CONSTS.CAMERA_MAXIMAL_DISTANCE, CONSTS.CAMERA_OPTIMAL_DISTANCE);
        return {
            entity,
            value: fFactor * fPrecision * fProximity,
            precision: fPrecision,
            distance,
            proximity: fProximity
        };
    }

    /**
     * Damage currently aimed ghosts
     * @param entity {Entity}
     * @param amount {number}
     * @returns {number}
     */
    damageGhost(entity, amount) {
        const nDamage = Math.ceil(
            amount
            * this.prop('getCameraEnergy')
            * this.prop('getCameraPower')
            / 100
        );
        entity.data.vitality -= nDamage;
        if (entity.data.vitality <= 0) {
            entity.thinker.kill();
        } else {
            entity.thinker.wound(false);
        }
        return nDamage;
    }

    /**
     * Change visor energy indicator to match the store value
     * @param aGhosts {[]} ghost that are actually being aimed by the visor
     * @param bSupernatural {boolean} true : la camaera est en train de viser un phenomène surnaturel
     */
    updateCameraEnergy(aGhosts, bSupernatural) {
        const nEnergy = aGhosts.reduce((prev, curr) => {
            return prev + curr.value;
        }, 0);
        if (nEnergy > 0) {
            this.commit(MUTATIONS.INC_ENERGY, {amount: nEnergy});
        } else {
            this.commit(MUTATIONS.DEC_ENERGY);
        }
        this.commit(MUTATIONS.AIMING_SUPERNATURAL, {value: bSupernatural});
    }

    /**
     * all camera indicators are shutdown, so the camera may be dropped silently
     * and the next time the camera is raised, the indicator won't be uninitialized (which greatly annoys me)
     */
    shutdownCameraIndicators() {
        this.commit(MUTATIONS.DEPLETE_ENERGY);
        this.commit(MUTATIONS.AIMING_SUPERNATURAL, {value: false});
    }

    /**
     * returns the currently accumulated energy (by aiming at ghosts)
     * @returns {number}
     */
    get energy() {
        return this.prop('getCameraEnergy');
    }

    /**
     * Return the maximum value of energy accumulation
     * @returns {number}
     */
    get energyMax() {
        return this.prop('getCameraEnergyMax');
    }

    /**
     * returns true if the camera is aiming at some supernatural thing
     * @returns {boolean}
     */
    get aimingSupernatural() {
        return this.prop('isCameraAimingSupernatural');
    }

    /**
     * returns the last time stamp, the camera has shot
     * to limit rate of fire
     */
    get lastShotTime() {
        return this.prop('getCameraLastShotTime');
    }

    depleteEnergy() {
        this.commit(MUTATIONS.DEPLETE_ENERGY);
    }

    shoot(time) {
        this.commit(MUTATIONS.SHOOT, {time});
    }
}

export default Visor;
