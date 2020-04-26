# Game Abstract

## Usage

### 1 - Write an extended class
This class assumes the role of an abstract. There is no such thing as abstract 
in javascript. That mean this class should not be instantiated, but extended.

```javascript
import GameAbstract from '../../src/libs/game-abstract';

class Game extends GameAbstract {
    // ... write your game here ...
}
```

Let's assume, for the rest of the document that you have a class named **Game**
that extends **GameAbstract**. And you have an instance **game** of this class.  

### 2 - Use the extended class

```javascript
async function runTheGame() {
    const g = new Game();
    g.config({ /* options */});
    await g.run();
}
```

You'll notice that the **.run()** method returns a promise. That's because the 
first level is fetched and loaded asynchronously (because textures themselves
are loaded asynchronously).
That explains the use of the **await** inside an **async function**.


## Configuration
You may config the Game instance. But you must do it before calling the .run() method. 
Here is a list of configuration properties you will use with the **.config()** method.


#### surface : HTMLCanvasElement
This property is a reference to a valid **HTMLCanvasElement**.
And this canvas MUST be present in the DOM at any time.
(If you want to render a raycasting scene on an offline Canvas, use the Renderer class only).
This canvas will be used to render the game. It will be refered as the **Game Surface**.
```
{
  "surface": document.querySelector("div.game canvas.screen")
}
```

#### overlay : HTMLElement
This property is a reference to a valid HTMLDivElement actually preset in the DOM.
This element will host a user interface that will be display exactly OVER the Game surface.
The overlay may initially be empty or filled with whatever components you like.
When the Game Surface is resized, the overlay is also resized to match 
the Game surface new size.
Expect that, the overlay is completly ignored by the Game Engine.
You may use whatever library you want to manage your overlay. Like Vue.js. The Game
Engine only deals with the Game surface. 

If you don't have any use of an overlay, you may set this property to "null"
```
{
  "overlay": document.querySelector("div.game div.overlay")
}
```

#### pointerlock : boolean
This property controls the pointerlock capability.
If set to true, the mouse pointer is capture when the user click on the Game surface.
Then, moving the mouse will turn the camera right or left.
When hitting the Escape key, the mouse cursor control is given back to the user.
To take control of the camera again, the user must clikck on the game surface again.
```
{
  "pointerlock": true
}
```

#### autostretch : boolean
If set to true, the Game surface will automatically stretch to reach the maximum
size within the navigator window. The aspect ration is always kept.
Note that the overlay (if defined) is always resized according to the game surface.
```
{
  "autostretch": true
}
```

#### mouseSensitivity : number
This value is initially set at 0.01 and should be set between 0.02 and 0.001.
When using the mouse to control the camera rotation, the sensitivity is used
to make the rotation faster or slower.
```
{
  "mouseSensitivity": 0.01
}
```

#### cameraThinker : string
The camera thinker is a class that extends the Thinker class.
You should set this value to the name of one of your own Thinker class to customize 
the behavior of the camera.

The default thinker "FPSCameraThinker" provides basic control with the camera.
It supports Mouse+WASD (or Mouse+ZQSD for french keyboards) classical FPS controls.
```
{
  "cameraThinker": "FPSCameraThinker"
}
```

#### loadProgress : function
This is a callback function, called several times during the level loading process
to indication the loading progression, because loading process may be long, especially
if there are a lot of textures to load.
```
{
  "loadProgress": function (phase, f) { 
    console.log(
      'loading phase', phase,
      'progress', Math.floor(f * 100).toString() + '%'
    );
  }
}
```

###END
That's pretty much all for the moment, this document will be completed in the future.
