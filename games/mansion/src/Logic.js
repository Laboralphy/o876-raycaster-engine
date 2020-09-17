import * as MUTATIONS from './store/modules/logic/mutation-types';
import * as ACTIONS from './store/modules/logic/action-types';
import StoreAbstract from "./StoreAbstract";
import * as Interpolator from "libs/interpolator";
import * as CONSTS from "./consts";
import Geometry from "libs/geometry";
import RangeCollider from "libs/range-collider";
import * as LOGIC_MUTATIONS from "./store/modules/logic/mutation-types";

class Logic extends StoreAbstract {
    constructor(store) {
        super('logic');
        this.store = store;
        this._rcCam = new RangeCollider();
    }

    /**
     * Fetch item data
     */
    loadData() {
        this.dispatch(ACTIONS.LOAD_ITEMS);
    }

    /**
     * Return data about an item
     * @param ref {string} item reference
     * @return {*}
     */
    getItemData(ref) {
        const items = this.prop('getItemData');
        const item = items.find(x => x.id === ref);
        if (!item) {
            throw new Error('This item could not be found : "' + ref + '"');
        }
        return item;
    }

    /**
     * Adds a quest items into player inventory
     * @param ref {string}
     */
    addQuestItem(ref) {
        this.commit(MUTATIONS.ADD_QUEST_ITEM, {ref});
    }

    /**
     * Removes a quest items from player inventory
     * @param ref {string}
     */
    removeQuestItem(ref) {
        this.commit(MUTATIONS.REMOVE_QUEST_ITEM, {ref});
    }

    /**
     * Tests if player possess a defined quest items
     * @param ref {string}
     */
    hasQuestItem(ref) {
        return this.prop('getQuestItems').indexOf(ref) >= 0;
    }

    /**
     * tech : updates camera width, so the ghost score may be correctly computed.
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
        return Logic._min_0_max_1(Interpolator.linear(value, val0, 0, val1, 1));
    }

    /**
     * Gets how much energy a ghost worth
     * and how many points the ghost photo will score
     * @param entity {Entity}
     * @return {{value, precision, distance}} ghost value from 0 (no value) to 1 (maximum possible value)
     */
    getGhostScore(entity) {
        const {visible, size, offset, distance} = entity.data.visibility;
        if (!visible) {
            return 0;
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
        const fPrecision = Logic._linear_0_1(Math.abs(wCamera - xGhost), radius, 0);
        const fDistance = distance < CONSTS.CAMERA_OPTIMAL_DISTANCE
            ? 1
            : Logic._linear_0_1(distance, CONSTS.CAMERA_MAXIMAL_DISTANCE, CONSTS.CAMERA_OPTIMAL_DISTANCE);
        return {
            value: fFactor * fPrecision * fDistance,
            precision: fPrecision,
            distance
        };
    }

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

    damagePlayer(ghost) {
        const nPower = ghost.data.power;
        const nDamage = nPower;
        this.commit(MUTATIONS.MODIFY_PLAYER_HP, {value: -nDamage});
    }

    isPlayerDead() {
        return this.prop('isPlayerDead');
    }

    /**
     * Change camera energy indicator to match the store value
     * @param aGhosts {Entity[]} ghost that are actually being aimed by the camera
     * @param bSupernatural {boolean} true : la camaera est en train de viser un phenomène surnaturel
     */
    updateCameraEnergy(aGhosts, bSupernatural) {
        const nEnergy = aGhosts.reduce((prev, curr) => {
            const oScore = this.getGhostScore(curr);
            return prev + oScore.value;
        }, 0);
        if (nEnergy > 0) {
            this.commit(LOGIC_MUTATIONS.INC_ENERGY, {amount: nEnergy});
        } else {
            this.commit(LOGIC_MUTATIONS.DEC_ENERGY);
        }
        this.commit(LOGIC_MUTATIONS.AIMING_SUPERNATURAL, {value: bSupernatural});
    }

    updateCameraLamp(n) {
        this.commit(LOGIC_MUTATIONS.SET_CAMERA_LAMP, {value: n});
    }

    shutdownCameraIndicators() {
        this.commit(LOGIC_MUTATIONS.DEPLETE_ENERGY);
        this.commit(LOGIC_MUTATIONS.AIMING_SUPERNATURAL, {value: false});
    }
}

export default Logic;