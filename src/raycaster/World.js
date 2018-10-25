/**
 * This class manages the world's state
 */

class World {
	constructor() {
		this.metrics = {
			height: 0,	// wallXed height of walls
			spacing: 0, // size of a cell, on the floor
		};
		this.visual = {		// all things visual
			fog: {			// fog setting (at long distance)
				color: '',	// fog color
				distance: 0, // distance where the fog at full intensity
			},
			filter: '',		// color filter for sprites (ambient color)
			brightness: 0	// base brightness
		};
	}
}

export default World;
