import MagBoltThinker from "./MagBoltThinker";
import Geometry from "../../../libs/geometry";
import cellSurfaceManager from "../../../libs/raycaster/CellSurfaceManager";

class HomingMagBoltThinker extends MagBoltThinker {
    s_move() {
        super.s_move()
        const nAngle = this.computeAngleToTarget()
        // essayer de reduire cet angle
        const nMaxTurnAngle = 0.1
        const oSelf = this.entity
        if (Math.abs(nAngle) <= nMaxTurnAngle) {
            // se tourner direct vers cible
            oSelf.position.angle -= nAngle
        } else {
            oSelf.position.angle -= Math.sign(nAngle) * nMaxTurnAngle
        }
    }

    computeAngleToTarget () {
        const oSelf = this.entity
        const oOwner = this._owner
        const oTarget = oOwner.thinker.target
        const pSelf = oSelf.position
        const pTarget = oTarget.position
    }
}


export default HomingMagBoltThinker;
