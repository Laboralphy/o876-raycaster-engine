/**
 * This class manages the world's state
 */

class World {
	constructor() {
		this.metrics = {
			height: 0,	// wallXed height of walls
			spacing: 0, // size of a cell, on the floor
		};
		this.camera = {
			height: 0,	// matches the number of pixels on the vertical axis
			width: 0,   // matches the number of pixels on the horizontal axis
			angle: Math.PI / 4	// this is the half - angle of view
		};
		this.visual = {		// all things visual
			fog: {			// fog setting (at long distance)
				color: '',	// fog color
				distance: 0, // distance where the fog at full intensity
			},
			filter: '',		// color filter for sprites (ambient color)
			brightness: 0,	// base brightness
			shading: {
                factor: 50,			// distance where the texture shading increase by one unit
                threshold: 16,    	// number of shading layers
                dim: 7,				// shading factor added to the y axis wall only, to simulate realistic lighting

			}
		};
	}
}

export default World;
