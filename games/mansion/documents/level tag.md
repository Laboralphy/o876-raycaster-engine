# Tag for level design

## bgm
- usage : bgm music/<music-ref>
- floor tag

Use it on floor to change background music when player walk in.

## item
- usage : item <item-ref>
- wall tag

Place an item decal on the wall, this decal will disapear when
player "pushes" the wall. The item will be added to player's inventory.

## doorsound
- usage : doorsound <sound-when-open> <sound-when-close>
- door tag

This tag will change door sound when open/close.

## discard
- usage : discard <item-ref>
- door tag

This tag will discard item (usually key) from player's inventory... 
But only if door is unlocked.

## lock
- usage : lock <item-ref>
- door tag

This tag makes a door locked, if the players has the key, the lock is removed
The designer must add a keyhole decal on the door.

If no key is specified, the door remains locked and only scripts may unlock it.

## trigsound
- usage : trigsound ambiance/<sound-ref>
- floor/block tag

Will emit an ambient sound when player walks in.

## ambsound
- usage : ambsound <sound-ref>
- floor/block tag

Will continuously play a localized ambiant sound.

## photo
- usage 1 : photo <photo-script-ref>
- usage 2 : photo <type> <photo-ref> <score-ref>
- block tag

Usage 1 : Will run a photo script.
Usage 2 : Will store a photo in ambient/art tab with the corresponding score.


## locator
- usage : locator <ref>
- floor tag

Mark the floor cell as locator : scripts may refer to this floor cell
to spawn ghosts or place photo clues.

## sense
- usage : sense <ref>
- floor tag

Mark the floor cell as a supernatural place that will enlight the camera
filament.

## archive
- usage : archive <photo-ref>
- floor/door/block tag

Move a photo clue into "archive" tab.

## event
- usage : event <script-ref>
- block/floor tag

Trigger a special event, runs a script in the event folder.
Used when complex mechanism is needed (spawning ghost, resolving clues).

## goto
- usage : goto <level-ref> <startpoint>
- floor/block tag

Load another level and places player at spécified startpoint.
