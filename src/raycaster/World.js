/**
 * This class manages the world's state
 */

class World {
	constructor() {
		this.metrics = {
			height: 0,	// normal height of walls
			spacing: 0, // size of a cell, on the floor
		};
		this.visual = {		// all things visual
			fog: {			// fog setting (at long distance)
				color: '',	// fog color
				intensity: 0, // fog intensity
			},
			filter: '',		// color filter for sprites (ambient color)
			brightness: 0	// if > 0 then wall are emiting light that counters fog
		};
	}
}

export default World;
