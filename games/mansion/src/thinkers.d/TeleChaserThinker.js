import VengefulThinker from "./VengefulThinker";

/**
 * 1) le fantôme suit la cible pendant 5 secondes, il ne se téléporte pas
 *
 * 2) le fantôme suit la cible et se téléportera s'il arrive assez près
 *
 * 3) avant de se téléporter le fantome fait une pause de 0.75 seconde, durant ce laps de temps, le shutter chance est allumé
 * si le fantôme est bléssé, la téléportation est annulée et on va en 1)
 *
 * 4) le fantôme se téléporte derrière sa cible
 *
 * 5) Le fantôme va en 1)
 *
 * testé le 2023-03-15
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
        init: ['$unwound', '$shutterChance 1'],
        done: ['$shutterChance 0'],
        jump: [{
          test: '$isWoundedCritical',
          state: 'init'
        }, {
          test: '$elapsedTime 750',
          state: 'teleport'
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
}
export default TeleChaserThinker;
