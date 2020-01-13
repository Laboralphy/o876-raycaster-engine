# Managing entities

## spawn a ghost

```application/javascript
const oNewGhost = GAME.spanwGhost(sRef, xCell, yCell)
```
- sRef : string - the reference to the ghost blueprint.
- xCell, yCell : number - the ghost spawn point


## get player information
```
const position = GAME.engine.camera.position
``` 
