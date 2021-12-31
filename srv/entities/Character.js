/**
 * @class Character
 * @property id {number}
 * @property name {string}
 * @property owner {number} // identifiant utilisateur propriétéaire
 * @property dateCreation {number}
 * @property dateLastUsed {number}
 */
class Character {
  constructor (payload) {
    this.id = payload.id
    this.name = payload.name
    this.owner = payload.owner // identifiant de l'utilisateur
    this.dateCreation = payload.dateCreation
    this.dateLastUsed = payload.dateLastUsed
    this.selected = payload.selected
  }
}

module.exports = Character
