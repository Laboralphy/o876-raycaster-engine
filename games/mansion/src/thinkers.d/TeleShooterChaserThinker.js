import VengefulThinker from "./VengefulThinker";
const THINKER_DISTANCE_TELEPORT_BEHIND = 256; // distance à laquel le ghost va téléporter

/**
 * Le fantome se déplace au hasard et tire en se téléportant
 */
class TeleShooterChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.transitions = {
            "gs_init": [
                [1, "gs_chase_without_teleport"]
            ],

            "gs_chase_without_teleport_init": [
                [1, "gs_time_3000_ish", "gs_chase_without_teleport"]
            ],

            "gs_chase_without_teleport": [
                ["gt_time_out", "gs_chase"]
            ],

            // si la cible est proche, on s'arrete, on active shutterchance, on se téléporte
            // sinon on continue de chaser
            "gs_chase": [
                ["gt_target_close", "gs_teleport_behind", "gs_shutter_chance_on", "gs_stop", "gs_teleport_out"]
            ],

            "gs_teleport_out": [
                ["gt_has_teleported", "gs_shutter_chance_off", "gs_chase_without_teleport_init"]
            ],

            "gs_is_going_to_shoot": [
                // tirer, attendre 2s puis re chaser
                ["gt_critical_wounded", "gs_time_250", "gs_shutter_chance_off", "gs_wait_after_shoot"],
                ["gt_time_out", "gs_shoot", "gs_time_250", "gs_shutter_chance_off", "gs_wait_after_shoot"]
            ],

            "gs_wait_after_shoot": [
                ["gt_time_out", "gs_chase", "gs_start_1"]
            ]
        }
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    gs_chase() {
        this.moveTowardTarget();
    }

    gs_chase_without_teleport_init() {
        this.moveTowardTarget();
    }

    gs_teleport_behind () {
        this.computeTeleportBehind();
    }

    // timer d'environ 3000 ms (+- 500ms
    gs_time_3000_ish () {
        this._setGhostTimeOut(Math.floor(Math.random() * 1000 + 2500));
    }

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    gt_target_close () {
        return this.getDistanceToTarget() < THINKER_DISTANCE_TELEPORT_BEHIND;
    }

    gs_shoot() {
        this.moveTowardTarget(0, 0);
        // tirer un projectile
        const oMissileData = Array.isArray(this.entity.data.missile)
            ? this.entity.data.missile[Math.floor(Math.random() * this.entity.data.missile.length)]
            : this.entity.data.missile
        const sMissileResRef = oMissileData.resref
        const missile = this.engine.createEntity(sMissileResRef, this.entity.position);
        missile.thinker.fire(this.entity, oMissileData);
    }
}

export default TeleShooterChaserThinker
