import { unionInterpolationStops, unflat } from "./exponential.js";

// At this zoom, render switches from unified to differentiated
// bridge/tunnel rendering
const minzoomBrunnel = 11;

// Exponent base for zoom interpolation
const roadExp = 1.2;

// Width of road and casing
// Defined as one of
// [class, expressway, ramp]
// => zoom interpolation ramp
// => multiplier of one of the interpolation ramps
// Evaluated in order, so e.g. ramp then expressway then regular.
const roadWidth = [
  {
    id: "motorway_link",
    fill: [
      4, 1.0,
      7, 1.0,
      13, 1.5,
      14, 2.5,
      20, 11.5,
    ],
    casing: [
      4, 2.0,
      7, 2.0,
      13, 3.0,
      14, 4.0,
      20, 15.0,
    ],
  },
  {
    id: "motorway",
    fill: [
      4, 0.5,
      9, 1.0,
      20, 18.0,
    ],
    casing: [
      4, 1.5,
      9, 3.0,
      20, 22.0,
    ],
  },
  {
    id: "trunk_link",
    fill: ["*", 0.5, "trunk"],
    casing: ["*", 0.5, "trunk"],
  },
  {
    id: "trunk_expressway",
    fill: [
      4, 0.8,
      7, 0.8,
      9, 1.0,
      12, 3.5,
      20, 16.0,
    ],
    casing: [
      4, 1.5,
      7, 1.5,
      9, 3.0,
      12, 7.0,
      20, 28.0,
    ],
  },
  {
    id: "trunk",
    fill: [
      4, 0.5,
      9, 1.0,
      12, 4.0,
      20, 18.0,
    ],
    casing: [
      4, 0.5,
      9, 1.2,
      12, 5.0,
      20, 22.0,
    ],
  },
  {
    id: "primary_expressway",
    fill: "trunk_expressway",
    casing: ["*", 0.9, "trunk_expressway"],
  },
  {
    id: "primary_link",
    fill: ["*", 0.45, "trunk"],
    casing: ["*", 0.45, "trunk"],
  },
  {
    id: "primary",
    fill: ["*", 0.9, "trunk"],
    casing: ["*", 0.9, "trunk"],
  },
  {
    id: "secondary_expressway",
    fill: ["*", 0.7, "trunk"],
    casing: ["*", 0.7, "trunk"],
  },
  {
    id: "secondary_link",
    fill: ["*", 0.3, "trunk"],
    casing: ["*", 0.3, "trunk"],
  },
  {
    id: "secondary",
    fill: ["*", 0.6, "trunk"],
    casing: ["*", 0.6, "trunk"],
  },
  {
    id: "tertiary_link",
    fill: ["*", 0.25, "trunk"],
    casing: ["*", 0.25, "trunk"],
  },
  {
    id: "tertiary",
    fill: ["*", 0.5, "trunk"],
    casing: ["*", 0.5, "trunk"],
  },
  {
    id: "minor",
    fill: ["*", 0.3, "trunk"],
    casing: ["*", 0.3, "trunk"],
  },
  {
    id: "small_service",
    fill: ["*", 0.15, "trunk"],
    casing: ["*", 0.15, "trunk"],
  },
  {
    id: "service",
    fill: ["*", 0.2, "trunk"],
    casing: ["*", 0.2, "trunk"],
  },
];

const buildRoadWidthInterpolation = (getter) => unionInterpolationStops(roadWidth.flatMap(obj => {
  const stops = getter(obj);
  if (Array.isArray(stops) && stops[0] != "*") {
    return [
      {
        id: obj.id,
        stops,
      },
    ];
  } else {
    return [];
  }
}), roadExp);

const [roadFillWidthInterpolation, roadFillInterpolationLabels] = buildRoadWidthInterpolation(obj => obj.fill);
const [roadCasingWidthInterpolation, roadCasingInterpolationLabels] = buildRoadWidthInterpolation(obj => obj.casing);

const buildLets = (interpolationObjList) => [
  ...interpolationObjList.flatMap((obj) => unflat(obj.stops).flatMap(([label, value]) => [
    `z${label}_${obj.id}`,
    value,
  ])),
];

const highwayClasses = ["motorway", "trunk", "primary", "secondary", "tertiary", "minor", "service"];

export const highwayFilter = ["in", ["get", "class"], ["literal", highwayClasses]];

const buildCase = (id) => {
  const result = ["all"];
  for (const k of id.split("_")) {
    if (highwayClasses.includes(k)) {
      result.push(["==", ["get", "class"], k]);
    } else if (k == "expressway") {
      result.push(["==", ["get", "expressway"], 1]);
    } else if (k == "link") {
      result.push(["==", ["get", "ramp"], 1]);
    } else if (k == "small") {
      result.push(["in", ["get", "service"], ["literal", ["driveway", "parking_aisle"]]]);
    } else {
      throw new TypeError(`${id} - ${k}`);
    }
  }
  return result;
};

const buildRoadWidthCases = getter => label => [
  label,
  [
    "case",
    ...roadWidth.flatMap((obj) => {
      const theCase = buildCase(obj.id);
      const varify = (v) => ["var", `z${label}_${v}`];
      const shouldVarify = (v) => (typeof v == "string" && v !== "*");
      const mayVarify = (v) => shouldVarify(v) ? varify(v) : v;
      let theValue = getter(obj);
      if (Array.isArray(theValue)) {
        if (theValue[0] == "*") {
          theValue = theValue.map(v => mayVarify(v));
        } else {
          // Lookup interpolation steps defined inline
          theValue = varify(obj.id);
        }
      } else {
        theValue = mayVarify(theValue);
      }
      return [
        theCase,
        theValue,
      ];
    }),
    // Obvious fallback
    0.125,
  ],
];

const roadFillWidthCases = buildRoadWidthCases(obj => obj.fill);
const roadCasingWidthCases = buildRoadWidthCases(obj => obj.casing);

const buildLineWidth = (interpolationLets, interpolationLabels, cases) => [
  "let",
  ...buildLets(interpolationLets),
  [
    "interpolate",
    ["exponential", roadExp],
    ["zoom"],
    ...interpolationLabels.flatMap((label) => cases(label)),
  ],
];

export const highwayFillWidth = buildLineWidth(
  roadFillWidthInterpolation,
  roadFillInterpolationLabels,
  roadFillWidthCases);

export const highwayCasingWidth = buildLineWidth(
  roadCasingWidthInterpolation,
  roadCasingInterpolationLabels,
  roadCasingWidthCases);

