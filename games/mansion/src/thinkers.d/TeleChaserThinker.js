import VengefulThinker from "./VengefulThinker";

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
    this.ghostAI.defineStates({
      init: {
        // Suit la cible sans se téléporter pendant 5 s
        loop: ['$followTarget'],
        jump: [{
          test: '$elapsedTime 5000',
          state: 'mayTeleport'
        }]
      },
      mayTeleport: {
        // Suit la cible mais peut se téléporter si proche
        loop: ['$followTarget'],
        jump: [{
          test: '$isTargetCloserThan 256',
          state: 'teleport'
        }]
      },
      teleport: {
        init: ['$teleportBehindTarget']

      }
    })
    this.ghostAI.transitions = {
      "gs_init": [
        [1, "gs_chase_without_teleport_init"]
      ],

      "gs_chase_without_teleport_init": [
        [1, "gs_time_3000_ish", "gs_chase_without_teleport"]
      ],

      "gs_chase_without_teleport": [
        ["gt_time_out", "gs_chase"]
      ],

      "gs_chase": [
        ["gt_target_close", "gs_teleport_behind", "gs_shutter_chance_on", "gs_stop", "gs_teleport_out"]
      ],

      "gs_teleport_out": [
        ["gt_has_teleported", "gs_shutter_chance_off", "gs_chase_without_teleport_init"]
      ]
    }
  }

  ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
  ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
  ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

  gs_chase() {
    this.moveTowardTarget();
  }

  gs_chase_without_teleport() {
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

  $isTargetCloserThan (nDist) {
    return this.getDistanceToTarget() < nDist;
  }

}
export default TeleChaserThinker;
