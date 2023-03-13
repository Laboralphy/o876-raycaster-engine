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
        done: ['$stop'],
        jump: [{
          test: '$isTargetCloserThan 256',
          state: 'pauseBeforeTeleport'
        }]
      },
      pauseBeforeTeleport: {
        init: ['$shutterChance 1'],
        done: ['$shutterChance 0'],
        jump: [{
          test: '$elapsedTime 750',
          state: 'teleport'
        }, {
          test: '$isWoundedCritical',
          state: 'init'
        }]
      },
      teleport: {
        done: ['$teleportBehindTarget'],
        jump: [{
          state: 'init'
        }]
      }
    })
  }

  ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
  ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
  ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

  ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
  ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
  ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

  $isTargetCloserThan (nDist) {
    return this.getDistanceToTarget() < nDist;
  }

  $followTarget() {
    this.moveTowardTarget()
  }

}
export default TeleChaserThinker;
