import { unionInterpolationStops } from "./exponential.js";
import { makeVar, assembleProperty } from "./interpolation.js";
import { buildCase, roadExp } from "./road-common.js";

const minzoomBrunnel = 11;

const roadHue = 0;
const tollRoadHue = 48;

const roadFillColor = (hue, minZoom, transitionZoom) => {
  const transitionStop = transitionZoom
    ? [transitionZoom, `hsl(${hue}, 0%, 23%)`]
    : [];
  return [
    minZoom,
    `hsl(${hue}, 0%, 75%)`,
    ...transitionStop,
    14.9999,
    `hsl(${hue}, 0%, 23%)`,
    15,
    `hsl(${hue}, 100%, 100%)`,
  ];
}

const tollRoadFillColor = (hue, minZoom, transitionZoom) => {
  const transitionStop = transitionZoom
    ? [transitionZoom, `hsl(${hue}, 100%, 40%)`]
    : [];
  return [
    minZoom,
    `hsl(${hue}, 100%, 75%)`,
    ...transitionStop,
    14.9999,
    `hsl(${hue}, 100%, 40%)`,
    15,
    `hsl(${hue}, 100%, 75%)`,
  ];
}

const roadCasingColor = (hue, minZoom) => [
  minZoom,
  `hsl(${hue}, 0%, 90%)`,
  14.9999,
  `hsl(${hue}, 0%, 90%)`,
  15,
  `hsl(${hue}, 0%, 23%)`,
];

const expresswayCasingColor = (hue, minZoom, transitionZoom) => [
  minZoom,
  `hsl(${hue}, 0%, 75%)`,
  transitionZoom,
  `hsl(${hue}, 0%, 23%)`,
];

const roadColor = [
  {
    id: "motorway_toll",
    fill: [
      4, `hsl(${tollRoadHue}, 70%, 76%)`,
      6, `hsl(${tollRoadHue}, 70%, 66%)`,
      minzoomBrunnel - 0.5, `hsl(${tollRoadHue}, 70%, 60%)`,
      14, `hsl(${tollRoadHue}, 71%, 45%)`,
    ],
    casing: [
      4, `hsl(${tollRoadHue}, 10%, 85%)`,
      6, `hsl(${tollRoadHue}, 60%, 50%)`,
      minzoomBrunnel - 0.5, `hsl(${tollRoadHue}, 71%, 40%)`,
      14, `hsl(${tollRoadHue}, 51%, 9%)`,
    ],
    surface: `hsl(${tollRoadHue}, 50%, 70%)`,
  },
  {
    id: "motorway",
    fill: [
      4, `hsl(${roadHue}, 70%, 76%)`,
      6, `hsl(${roadHue}, 70%, 66%)`,
      minzoomBrunnel - 0.5, `hsl(${roadHue}, 70%, 60%)`,
      14, `hsl(${roadHue}, 71%, 35%)`,
    ],
    casing: [
      4, `hsl(${roadHue}, 10%, 85%)`,
      6, `hsl(${roadHue}, 60%, 50%)`,
      minzoomBrunnel - 0.5, `hsl(${roadHue}, 71%, 40%)`,
      14, `hsl(${roadHue}, 51%, 9%)`,
    ],
    surface: `hsl(${roadHue}, 50%, 70%)`,
  },
  {
    id: "trunk_expressway",
    fill: `hsl(${roadHue}, 95%, 95%)`,
    casing: `hsl(${roadHue}, 77%, 50%)`,
  },
  {
    id: "trunk_expressway_toll",
    fill: `hsl(${tollRoadHue}, 95%, 95%)`,
    casing: `hsl(${tollRoadHue}, 77%, 50%)`,
  },
  {
    id: "trunk",
    fill: `hsl(${roadHue}, 77%, 50%)`,
    casing: [
      5, `hsl(${roadHue}, 77%, 50%)`,
      9, `hsl(${roadHue}, 77%, 50%)`,
      15, `hsl(${roadHue}, 70%, 18%)`,
    ],
    surface: `hsl(${roadHue}, 95%, 80%)`,
  },
  {
    id: "trunk_toll",
    fill: `hsl(${tollRoadHue}, 77%, 50%)`,
    casing: [
      5, `hsl(${tollRoadHue}, 77%, 50%)`,
      9, `hsl(${tollRoadHue}, 77%, 50%)`,
      15, `hsl(${tollRoadHue}, 70%, 18%)`,
    ],
    surface: `hsl(${tollRoadHue}, 95%, 80%)`,
  },
  // etc.
  // enough to start out
];

const buildRoadColorInterpolation = (getter) => unionInterpolationStops(roadColor.flatMap(obj => {
  const stops = getter(obj);
  if (Array.isArray(stops)) {
    // Defines a list of interpolation labels/values
    return [
      {
        id: obj.id,
        stops,
      }
    ];
  } else {
    // Doesn't - defines a literal color or refers to another named value.
    return [];
  }
}), roadExp);

const [roadFillColorInterpolation, roadFillInterpolationLabels] = buildRoadColorInterpolation(obj => obj.fill);
const [roadCasingColorInterpolation, roadCasingInterpolationLabels] = buildRoadColorInterpolation(obj => obj.casing);
const [roadSurfaceColorInterpolation, roadSurfaceInterpolationLabels] = buildRoadColorInterpolation(obj => obj.surface);

const buildRoadColorCases = getter => label => [
  label,
  [
    "case",
    ...roadColor.flatMap((obj) => {
      const theCase = buildCase(obj.id);
      let theValue = getter(obj);
      const varify = (v) => ["var", makeVar(label, v)];
      const shouldVarify = (v) => (typeof v == "string" && !v.match('^hsl'));
      const mayVarify = (v) => shouldVarify(v) ? varify(v) : v;
      if (Array.isArray(theValue)) {
        // Fetch the interpolation steps we extracted
        theValue = varify(obj.id);
      } else {
        theValue = mayVarify(theValue);
      }
      return [
        theCase,
        theValue,
      ];
    }),
    // Obvious fallback
    'magenta',
  ],
];

const roadFillColorCases = buildRoadColorCases(obj => obj.fill);
const roadCasingColorCases = buildRoadColorCases(obj => obj.casing);
const roadSurfaceColorCases = buildRoadColorCases(obj => obj.surface);

export const highwayFillColor = assembleProperty(
  roadFillColorInterpolation,
  roadFillInterpolationLabels,
  roadFillColorCases,
  roadExp);

export const highwayCasingColor = assembleProperty(
  roadCasingColorInterpolation,
  roadCasingInterpolationLabels,
  roadCasingColorCases,
  roadExp);

export const highwaySurfaceColor = assembleProperty(
  roadSurfaceColorInterpolation,
  roadSurfaceInterpolationLabels,
  roadSurfaceColorCases,
  roadExp);
