import * as CONSTS from './raycaster/consts';
import Thinkers from './engine/thinkers'
import Renderer from './raycaster/Renderer';
import Engine from './engine/Engine';

import CanvasHelper from './canvas-helper/CanvasHelper';
import MapHelper from './raycaster/MapHelper';
import ArrayHelper from './array-helper';
import Bresenham from './bresenham';
import Easing from './easing';
import GeometryHelper from './geometry/GeometryHelper';
import Point from './geometry/Point';
import Vector from './geometry/Vector';
import Grid from './grid';
import * as interpolator from './interpolator';
import * as levenshtein from './levenshtein';
import Rainbow from './rainbow';


export default {
	CONSTS,
	Engine,
	Renderer,
	Thinkers,
	helpers: {
		Canvas: CanvasHelper,
		Map: MapHelper,
		Array: ArrayHelper,
		Bresenham,
		Easing,
		Geometry: GeometryHelper,
		Point,
		Vector,
		Grid,
		interpolator,
		levenshtein,
		Rainbow
	}
};
