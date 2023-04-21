# Crée un item "Note"

## Description

Ce genre d'item se place dans la partie "Note" et sert à expliquer le contexte de l'aventure.

## Etapes

1) Créer ou réutiliser un sprite de note/livre à coller au mur ou au sol
2) Créer un fichier <item-ref>.json dans assets/data/items contenant les données suivantes
```json
{
  "type": "<type-d'item> (plot, key, book)",
  "icon": "<reférence de l'icone> (les icones sont dans assets/icons",
  "thumbnail": "Miniature",
  "value": "VALEUR NUMERIQUE DU SCORE"
}
```
3) Créer ou réutiliser le thumbnail.
4) Créer une entrée dans assets/strings/<lang>/items/<item-ref>.json contenant les données suivantes :
```json
{
  "name": "Nom de la note",
  "description": ["description de la note"]
}
```
5) Tagger la zone de déclenchement avec "item <item-ref>"