### lookAtTarget()
Change la direction de mouvement du fantôme pour qu'il pointe vers la cible

### moveTowardTarget(speed, angle)
Modifie le vecteur vitesse du fantôme.

#### speed : vitesse de déplacement
#### angle : variation d'angle


## Actions

### $stop

Arrêt du mobile.

### $teleportBehindTarget

Se téléporte derrière la cible.

### $followTarget(speed, angle)

Suit la cible avec un facteur de vitesse (défaut 1) et une dérive d'angle (défaut 0) spécifiés.

### $shutterChance(active)

Si on spécifie 1 cela active le shutter-chance (occasion de coup critique)
si on spécifie 0 cela supprime le shutter-chance. 

## Tests

### $elapsedTime(duration)

Renvoie true si le temps écoulé depuis le début de l'état dépasse la valeur passée en 
paramètre.

### $isWoundedCritical

Renvoie true si le fantôme a été blessé par un coup critique.
