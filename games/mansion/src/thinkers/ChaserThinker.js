import VengefulThinker from "./VengefulThinker";

/**
 * Le fantome ne fait que suivre bêtement le target
 */
class ChaserThinker extends VengefulThinker {

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    s_chase() {
        this.moveForward();
    }

}


export default ChaserThinker;