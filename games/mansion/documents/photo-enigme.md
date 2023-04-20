1) Ajouter un tag photo <photo-ref>
2) Ajouter un tag sense <photo-ref>
3) copier les script suivant dans le fichier photo-ref.js (dossier script.d/photo)
```js
const CONSTS = require('../../consts')

export function main(game, remove, x, y) {
    game.runScript('action.takeAmbientPhoto', '<photo-ref>', CONSTS.PHOTO_SCORE_UNCOMMON);
    game.removeSense('<photo-ref>');
    remove();
}
```
4) Ajouter un fichier assets/strings/fr/photos/<photo-ref>.json avec la structure suivante :
```json
{
  "title": "titre de la photo",
  "description": [
    "Description de la photo."
  ]
}
```