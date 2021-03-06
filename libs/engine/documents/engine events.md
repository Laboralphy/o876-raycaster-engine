#Engine events

##initialized
This event is emitted when the engine is initialized. No parameter.

##update
This event is emitted when an update occurs. This event is triggered many times per second, so only fast handler
must be attached to this event, to avoid performance issues. No parameter.

##render
This event is emitted when an image is rendered. Like the 'update' event, this event is triggered many times
per second, so only fast handler must be attached to this event, to avoid performance issues. No parameter.

#level.loading
This event is fired when a level is loading
- phase : name of phase
- progress : floating number, indicator of progression

##level.loaded
This event is fired when a level is fully loaded

##door.locked
This event is fired when an attempt to open a locked door occurs
parameters :
- x : cell door coordinates
- y : cell door coordinates

##door.open
This event is fired when an attempt an unlocked door is succesfully opened.
- x : cell door coordinates
- y : cell door coordinates
- context : door context instance

##door.closing
This event is fired when a door begins to close.
- x : cell door coordinates
- y : cell door coordinates

##door.closed
This event is fired when a door shuts.
- x : cell door coordinates
- y : cell door coordinates

##entity.created
A new entity has been created.
- entity : newly created entity instance

##entity.destroyed
An entity has just been destroyed.
- entity : recently destroyed entity instance

##tag.xxxx.enter
This event is emitted when an entity enters a "xxxx" tagged zone.
- entity : the entity that entered the tagged zone.
- parameters : the tag parameters, defined during level design phase.
- remove : if the event handler call this function, the tag is removed.

##tag.xxxx.leave
This event is emitted when an entity leaves a "xxxx" tagged zone.
- entity : the entity that left the tagged zone.
- parameters : the tag parameters, defined during level design phase.
- remove : if the event handler call this function, the tag is removed.

##tag.xxxx.push
This event is emitted when an entity "pushes" a "xxxx" tagged block.
- entity : the entity that pushed the tagged block.
- parameters : the tag parameters, defined during level design phase.
- remove : if the event handler call this function, the tag is removed.

##think.xxxx
Events emitted by thinker via their ".emit" method.

##think.state
A default thinker event emitted when a thinker changes state.
- value : new state value



#Engine.screen events

##pointerlock.enter
This event is emitted when the user click on the game surface and takes controls of the camera. No parameter.

##pointerlock.exit
This event is emitted when the user hit the "escape" key and exits pointer lock mode. No parameter.
