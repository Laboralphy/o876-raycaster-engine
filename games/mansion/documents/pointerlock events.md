#Pointerlock Events
#sumup
If you need to do something whenever you enter or exiot pointer lock mode, here is how to do :

```js
this.screen.on('pointerlock.exit', () => {
    // ....
    // code to be run when the user hits 'ESC'
});

this.screen.on('pointerlock.enter', () => {
    // ....
    // code to be run when the user clicks on the surface canvas 
    // and goes back to pointerlock mode
});
```
