#Protocol

Chaque service ajoute son lot de message de communication client-server.

## Serveur -> Client 
###G_DOOR_OPEN
Le client doit ouvrir une porte.
- x : coordonnées de la porte (x)
- y : coordonnées de la porte (y)

###G_DOOR_CLOSE
Le client doit fermer un porte
- x : coordonnées de la porte (x)
- y : coordonnées de la porte (y)

###G_CREATE_MOBILE
Le client doit créer un mobile.
- mobile
	- id: identifiant du mobile à créer, sert de référence dans les échanges futurs concernant l'état de ce mobile
    - x: position initiale du mobile (x)
	- y: position initiale du mobile (y)
	- a: angle initial du mobile
	- sx: vitesse initiale du mobile (x)
	- sy: vitesse initiale du mobile (y)
	- bp: référence du blueprint du mobile

###G_DESTROY_MOBILE
Le client doit détruire un mobile. Les données transmisent sont les même pour la création.
De cette manière le client peut synchroniser une dernière fois la position et l'aspect finale
de la destruction du mobile.
- mobile
	- id: identifiant du mobile à créer, sert de référence dans les échanges futurs concernant l'état de ce mobile
    - x: position finale du mobile (x)
	- y: position finale du mobile (y)
	- a: angle final du mobile
	- sx: vitesse finale du mobile (x)
	- sy: vitesse finale du mobile (y)
	- bp: référence du blueprint du mobile

###G_UPDATE_MOBILE
Le client doit modifier le comportement de plusieurs mobiles.
- mobile
    - array of
        - id: identifiant du mobile concerné
        - a: nouvel angle,
        - x: nouvelle position (x)
        - y: nouvelle position (y)
        - sx: nouvelle vitesse aux axes (x)
        - sy: nouvelle vitesse aux axes (y)
    
###G_ERROR
Le client reçoit une notification d'erreur.
- err: contenue du message d'erreur

###G_LOAD_LEVEL
Le client reçoit les données du niveau.
- level: données statique du niveau
- live: données concernant les changement à apporter (état des portes etc...) 

###G_CONTROL_MOBILE
Le clinet recois 'lidentifiant du mobile dont il a la charge.
- id: identifiant du mobile dont on le client doit prend en charge le controle
- speed: vitesse actuelle du mobile


##Client -> Serveur

###G_READY
Le client est prêt pour une phase donnée.
- phase: code de la phase pour laquelle le client est pret.

la phase peut avoir l'une des valeurs suivantes :
- GAME_INITIALIZED: le client a fini d'initialiser son jeu, et il peut recevoir des données du niveau
- ENTERING_LEVEL: le client a fini de charger le niveau et toutes les ressources associées.

###REQ_G_UPDATE_PLAYER
Le client met à jour l'état de son mobile
- t: identifiant temporel*
- a: nouvel angle
- x: nouvelle position (x)
- y: nouvelle position (y)
- sx: nouvelle vitesse aux axes (x)
- sy: nouvelle vitesse aux axes (y)
- id: identifiant du mobile**
- c: état des commandes (masque binaire)

\* ne semble pas être utilisé

\*\* ne devrait pas être utilisé

Le paramètre __t__ est inutile car un packet de correction est immédiatement renvoyé en callback,
le client peut donc faire le lien entre le packet envoyé et la réponse reçue. Initialement 
le paramètre __t__ servait à indiquer quel packet de mouvement corriger.

####Retour :
- a: correction angle
- x: correction position (x)
- y: correction position (y)
- sx: correction vitesse aux axes (x)
- sy: correction vitesse aux axes (y)
- id: id


###REQ_G_LOAD_RSC
Demande de ressource.
- type: type de ressource (b ou t)
- ref: référence de la ressources


