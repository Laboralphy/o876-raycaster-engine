import LinearBoltThinker from "./LinearBoltThinker";

class HomingBoltThinker extends LinearBoltThinker {
    constructor () {
        super()
        this.ANGLE_TURNING = 0.05
    }

    $move() {
        super.$move()
        const nAngle = this.vectorToTarget().angle()
        // essayer de reduire cet angle
        this.setAngle(this.getAngleToTarget(nAngle))
    }

    getAngleToTarget(fTarget) {
        const m = this.entity;
        let fMe = m.position.angle;
        while (fTarget < 0) {
            fTarget += 2 * Math.PI;
            fMe += 2 * Math.PI;
        }
        // notre angle est fMe
        // il faudrait tourner vers fTarget
        if (Math.abs(fMe - fTarget) <= this.ANGLE_TURNING) {
            return fTarget
        }
        if (fMe < fTarget) {
            return fMe + this.ANGLE_TURNING
        }
        if (fMe > fTarget) {
            return fMe - this.ANGLE_TURNING
        }
        return fMe
    }

    vectorToTarget() {
        const oSelf = this.entity;
        const oOwner = this._owner
        const oTarget = oOwner.thinker.target
        const vSelf = oSelf.position
        const vTarget = oTarget.position
        return vTarget.vector().sub(vSelf.vector());
    }

}


export default HomingBoltThinker;
