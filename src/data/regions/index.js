// Country & Global wealth datasets for the Zakat simulation.
// To add a new country:
// 1. Copy one of the files in this folder (e.g. indonesia.js) -> <country>.js
// 2. Import and register it in REGIONS below
// 3. Run `npm test` to verify tier shares sum to 1.0 and simulation invariants hold

import world from './world.js';
import us from './us.js';
import uk from './uk.js';
import india from './india.js';
import indonesia from './indonesia.js';

export const REGIONS = {
  world,
  us,
  uk,
  india,
  indonesia,
};
