#How to define a new tileset
##sumup
Sometimes you need to define a new tileset.

Here is an example of a tileset definition :
```json
{
  "id": 36,
  "src": "assets/textures/3dfe537209635ce86dd4495761df8d8a.png",
  "width": 21,
  "height": 96,
  "animations": [
  ]
}
```
- __id__ : tileset identifier, usable in blueprints section.
- __src__ : tileset url of the png image.
- __width__ : width in pixels of a single frame in the set
- __height__ : height in pixels of a single frame in the set
- __animations__ : a list of animations


Here is the animation format : 
```json
{
  "id": "default", 
  "start": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ],
  "length": 3,
  "duration": 240,
  "loop": "@LOOP_FORWARD"
}
```
- __id__ : animation identifier, use "default" if you want this animation to be play right after instanciation.
- __start__ : list of starting frame for each direction.
- __length__ : number of frames in this animation.
- __duration__ : duration of each frame.
- __loop__ : accepted values are :
    - "@LOOP_FORWARD" : animation goes forward only, when reach last frame, it returns to first frame.
    - "@LOOP_YOYO" : animation goes forth and back.
    - "@LOOP_NONE" : no animation occurs.

