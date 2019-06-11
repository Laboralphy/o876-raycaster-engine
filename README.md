# O876 RAYCASTER ENGINE
This is a Raycasting Engine to help you build games based on raycasting and 
running on modern web browsers. This framework provides a WYSIWYG level editor hosted 
on an Express development server so you can immediatly start creating level.

## Getting started

### Prerequisites
You need :
* __node.js__ installed (version 10.x). And of course __npm__.
* A web browser like Chrome or Firefox.
(The framework has not been tested on neither Edge nor Safari).

### Installing
It depends whereas you want to used it or to contribute.
To include the framework in your game project, the installation procedure is currently :
```bash
npm install https://github.com/laboralphy/o876-raycaster-engine
```
but I'm still working on it.

As for contributing you just need to git clone, or fork the project.


### Running the tests
Tests are located at "./tests" and you just need to run :
```bash
npm test
```

### Running the server
There is a small embedded service. To start it just type :
```bash
node run serve
```
This will give you access to http://localhost:8080/ where you will be able to run demos, 
or the __map editor__. The service port can be changed by editing "./tools/service/config.js" 
and setting a new value for the __port__ variable.

