/**
 * Se débarrasser d'un objet qui a servi à déverrouiller un block
 * usage : discard <item-ref>
 * Suppression d'un item de l'inventaire lorsque celui ci ne sert plus à resoudre des enigme ou à ouvrir des portes.
 * Le tag n'agit que si le block auquel il est assigné n'est pas une porte fermée
 * il faut donc le placer au plus bas dans la liste des tags du blocs
 * @param game {Game} instance du jeu
 * @param remove {function} fonction à appeler si l'on souhaite retirer le tag de la map
 * @param x {number} coordonnée x de la cellule ou se trouve le tag
 * @param y {number} coordonnée y de la cellule ou se trouve le tag
 * @param ref {string} référence de l'item à supprimer de l'inventaire
 */
export function push(game, remove, x, y, ref) {
    if (!game.engine.isDoorLocked(x, y)) {
        game.logic.removeInventoryItem(ref);
        remove();
    }
}
