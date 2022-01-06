import VengefulThinker from "./VengefulThinker";

const THINKER_DISTANCE_TELEPORT_BEHIND = 256; // distance à laquel le ghost va rusher
const THINKER_TELEPORT_IN_SIGHT = 1;
const THINKER_TELEPORT_BEHIND = 2;

/**
 * Will chase target normally.
 * When close enought to target : will teleport behind target
 * Will not use teleportation more than a few second
 *
 * testé : fonctionne correctement
 */
class TeleChaserThinker extends VengefulThinker {

  constructor() {
    super();
    this.ghostAI.transitions = {
      "gs_init": [
        [1, "gs_chase_no_tele_init"]
      ],

      "gs_chase_no_tele_init": [
        [1, "gs_time_3000_ish", "gs_chase_no_tele"]
      ],

      "gs_chase_no_tele": [
        ["gt_time_out", "gs_chase"]
      ],

      "gs_chase": [
        ["gt_target_close", "gs_teleport_behind", "gs_shutter_chance_on", "gs_stop", "gs_teleport_out"]
      ],

      "gs_teleport_out": [
        ["gt_has_teleported", "gs_shutter_chance_off", "gs_chase_no_tele_init"]
      ]
    }
  }

  ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
  ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
  ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

  gs_chase() {
    this.moveTowardTarget();
  }

  gs_chase_no_tele() {
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

}
export default TeleChaserThinker;
