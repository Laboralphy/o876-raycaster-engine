# Action scripts

Each script is named after a tag, and may contain the following functions :

- init : run during level initialisation phase.
- push : run when the tag is located inside a tagged wall block pushed by the player.
- enter : run when the player enters the tagged cell region (a cell region is a set of contiguous cells
that share the same tag)
- exit : run when the player exits the tagged cell region
