# Crée un item "Note"

## Description

Ce genre d'item se place dans la partie "Note" et sert à expliquer le contexte de l'aventure.

## Etapes

1) Créer ou réutiliser un sprite de note/livre à coller au mur ou au sol. Si utilisé au sol, il faut un "ref" dans le thing, car le système va devoir discriminer le sprite à effacer parmis tous le sautres sprites de la cellule, lorsque le joueur va marcher dessus.
2) Créer un fichier <item-ref>.json dans assets/data/items contenant les données suivantes
```json
{
  "type": "note (les notes laissées par les pnj sont de type 'note' toujours)",
  "icon": "<reférence de l'icone> (les icones sont dans assets/icons)",
  "thumbnail": "<vide> (ne sera pas affiché de toute façon dans le descriptif)",
  "value": 0
}
```
3) Créer une entrée dans assets/strings/<lang>/notes/<item-ref>.json contenant les données suivantes :
```json
{
  "title": "Nom de la note",
  "description": ["description de la note"]
}
```
4) Tagger la zone de déclenchement avec "item <item-ref>". Cela peut etre un mur si le sprite est collé au mur, ou au sol si le sprite est posé au sol.
