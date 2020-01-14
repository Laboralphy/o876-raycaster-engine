import VengefulThinker from './VengefulThinker';

class ChaserThinker extends VengefulThinker {
  constructor() {
    super();

    // le ghost poursuit inlassablement sa cible

    this.transitions = {
      ...this.transitions,
      "s_idle": {
        "1": "s_seek"
      },
      "s_seek": {
        "1": "s_forward"
      }
    };
  }


  s_seek() {
    this.lookAtTarget();
    this.pulse();
  }

  /**
   * ghost is chasing the player
   * 1) change the angle
   * 2) advance
   */
  s_forward() {
    this.moveForward();
    this.pulse();
  }

}

export default ChaserThinker;