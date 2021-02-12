import FadeOut from "libs/engine/filters/FadeOut";

class GameOver extends FadeOut {
  constructor () {
    super({ duration: 3000 });
  }

  render (canvas) {
    super.render(canvas);
    // display a game over message
  }
}

export default GameOver;
