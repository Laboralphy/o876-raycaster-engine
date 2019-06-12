# O876 RAYCASTER ENGINE
This is a Raycasting Engine aimed at building games based on raycasting and 
running on modern web browsers. This framework provides a WYSIWYG level editor hosted 
on an Express development server so you can immediatly start creating level.

## Getting started

### Prerequisites
You need :
* __node.js__ installed (version 10.x). And __npm__.
* A web browser like __Chrome__ or __Firefox__.
(The framework has not been tested on neither Edge nor Safari).

### Installing
To include the framework in your game project, the installation procedure is currently :
```bash
npm install --save https://github.com/laboralphy/o876-raycaster-engine
```
As the framework contains hundreds of files you'll also need __Webpack__ to build your 
own game project.
```bash
npm install --save-dev webpack webpack-cli
```

### Running the tests
Tests are located at "./tests" and you just need to run :
```bash
npm test
```

### Running the web server
There is a small embedded web service. It will provide tools to get information and give access to
the Map Editor (and creates your own level). This web server is intended to work locally for 
game-development and level-design purpose.

To make it run, add a script in your __package.json__ file.
```json
{
  "scripts": {
    "serve": "o876-raycaster-engine"
  }
}
```
... then open a terminal and type :
```bash
node run serve
```
The terminal will output something like this :
```bash
> o876-raycaster-engine

vault path :  /home/ralphy/.o876-raycaster-engine/vault
website url : http://localhost:8080/
listening port 8080
```
Open your web browser and go to the location written on the terminal output ; here : http://localhost:8080/

This will give you access a web page where you will be able to run demos, 
or running the __map editor__.

#### Web server configuration
You may add options to the script command line in order to configure :
* the port value is set by the __-p__ parameter.
* the location of map editor save files, is set by the __-s__ parameter.
* the location of the game project assets directory, is set by the __-g__ parameter.

When you want to configure these parameters, modify your script section in your 
__package.json__ file. 

The following example will change the server port from 8080 to 4444 :
```json
{
  "scripts": {
    "serve": "o876-raycaster-engine -p 4444"
  }
}
```

The game project assets directory is a bit tricky to explain so we'll provide an example :

You currently are in your project root director, with your package.json, webpack.config.js etc...
You have typed those "npm install" commands, and you want to start coding your game.
You decide that :
* your game will be located at ./game-src
* your levels will be at ./game-src/assets/levels
* your textures, at ./game-src/assets/textures

Modify your package.json as following :
```json
{
  "scripts": {
    "serve": "o876-raycaster-engine -g ./game-src/assets"
  }
}
```

However as the "export" process is still in development, this option is still unavailable.

