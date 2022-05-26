// Functions to convert a list of cases and interpolation ramps into the
// special format that the map requires, namely interpolation ramp at
// the top level.

import { unflat } from "./exponential.js";

export const buildLets = (interpolationObjList) => [
  ...interpolationObjList.flatMap((obj) => unflat(obj.stops).flatMap(([label, value]) => [
    `z${label}_${obj.id}`,
    value,
  ])),
];

