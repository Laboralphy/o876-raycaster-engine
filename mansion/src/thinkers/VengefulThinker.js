import MoverThinker from "../../../lib/src/engine/thinkers/MoverThinker";
import * as RC_CONSTS from "../../../lib/src/raycaster/consts";

class VengefulThinker extends MoverThinker {

  constructor() {
    super();
    this._nOpacity = 0; // indice de transparence 0 = invisible, 1 = 25% alpha ... 4 = 100% opacity
    this._nTime = 0;
    this._aDeathOpacity = null;
    this.transitions = {
      "s_spawn": {
        // commencer la phase d'apparition = alpha in
        "1": "s_spawning"
      },
      "s_spawning": {
        // lorsque la full opacity est atteinte ...
        "t_fullOpacity": "s_idle"
      },
      "s_kill": {
        "1": "s_dying"
      },
      "s_dying": {
        "t_doneDying": "s_fadeOut"
      },
      "s_fadeOut": {
        "t_doneFadeOut": "s_dead"
      }
    }
  }

  /**
   * Sets sprites flag according to opacity level
   */
  setOpacityFlags() {
    const sprite = this.entity.sprite;
    switch (this._nOpacity) {
      case 0:
        sprite.removeFlag(RC_CONSTS.FX_ALPHA_25 | RC_CONSTS.FX_ALPHA_50 | RC_CONSTS.FX_ALPHA_75);
        sprite.visible = false;
        break;

      case 1:
        sprite.removeFlag(RC_CONSTS.FX_ALPHA_50 | RC_CONSTS.FX_ALPHA_75);
        sprite.visible = true;
        sprite.addFlag(RC_CONSTS.FX_ALPHA_25);
        break;

      case 2:
        sprite.removeFlag(RC_CONSTS.FX_ALPHA_25 | RC_CONSTS.FX_ALPHA_75);
        sprite.visible = true;
        sprite.addFlag(RC_CONSTS.FX_ALPHA_50);
        break;

      case 3:
        sprite.removeFlag(RC_CONSTS.FX_ALPHA_25 | RC_CONSTS.FX_ALPHA_50);
        sprite.visible = true;
        sprite.addFlag(RC_CONSTS.FX_ALPHA_75);
        break;

      case 4:
        sprite.removeFlag(RC_CONSTS.FX_ALPHA_25 | RC_CONSTS.FX_ALPHA_50 | RC_CONSTS.FX_ALPHA_75);
        sprite.visible = true;
        break;
    }
  }


  /**
   * makes the ghost pulse
   */
  pulse() {
    ++this._nTime;
    this._nOpacity = (this._nTime & 1) + 3;
    this.setOpacityFlags();
  }


  ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
  ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
  ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

  /**
   * The ghost just has spawned, still invisible
   */
  s_spawn() {
    this._nOpacity = 0;
    this.entity.sprite.setCurrentAnimation('walk');
    this.setOpacityFlags();
  }

  /**
   * The ghost is spawning, the alpha prop is increasing
   */
  s_spawning() {
    ++this._nOpacity;
    this.setOpacityFlags();
  }

  /**
   * The state of "doing nothing"
   * The ghost is pulsating
   */
  s_idle() {
    this.pulse();
  }

  /**
   * the ghost has been killed
   */
  s_kill() {
    this.entity.sprite.setCurrentAnimation('death');
  }

  s_dying() {
    this.pulse();
  }

  s_fadeOut() {
    --this._nOpacity;
    this.setOpacityFlags();
  }

  s_dead() {
    if (!this.entity.dead) {
      this.entity.dead = true;
    }
  }

  /**
   * ghost is chasing the player
   * 1) change the angle
   * 2) advance
   */
  s_chase() {
      //
  }



  ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
  ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
  ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

  /**
   * tests if sprite has reach full opacity
   * @returns {boolean}
   */
  t_fullOpacity() {
    return this._nOpacity >= 4;
  }

  /**
   * Tests if dead opacity is depleted
   * @returns {boolean}
   */
  t_doneDying() {
    return this.entity.sprite.getCurrentAnimation().frozen;
  }

  t_doneFadeOut() {
    return this._nOpacity <= 0;
  }
}


export default VengefulThinker;