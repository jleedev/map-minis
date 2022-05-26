// Functions to convert a list of cases and interpolation ramps into the
// special format that the map requires, namely interpolation ramp at
// the top level.

import { unflat } from "./exponential.js";

const buildLets = (interpolationObjList) => [
  ...interpolationObjList.flatMap((obj) => unflat(obj.stops).flatMap(([label, value]) => [
    makeVar(label, obj.id),
    value,
  ])),
];

export const assembleProperty = (interpolationLets, interpolationLabels, cases, roadExp) => [
  "let",
  ...buildLets(interpolationLets),
  [
    "interpolate",
    ["exponential", roadExp],
    ["zoom"],
    ...interpolationLabels.flatMap((label) => cases(label)),
  ],
];

export const makeVar = (label, v) => `z${label}_${v}`.replace(".", "_");
