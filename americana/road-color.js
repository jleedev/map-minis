export const lineCasingColor = [
  "match",
  ["get", "class"],
  ["motorway", "trunk"],
  "maroon",
  "black",
];

export const lineFillColor = [
  "match",
  ["get", "class"],
  ["motorway", "trunk"],
  [
    "match",
    ["get", "ramp"],
    [1],
    "red",
    [
      "match",
      ["get", "expressway"],
      [1],
      "white",
      "red",
    ],
  ],
  "silver",
];

// ^^^ entirely temporary

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
    casing: "motorway",
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
    casing: "trunk",
    surface: `hsl(${tollRoadHue}, 95%, 80%)`,
  },
  // etc.
  // enough to start out
];

/*
export const highwayFillColor = buildLineColor(
  roadFillColorInterpolation,
  roadFillInterpolationLabels,
  roadFillColorCases);

export const highwayCasingColor = buildLineColor(
  roadCasingColorInterpolation,
  roadCasingInterpolationLabels,
  roadCasingColorCases);
*/
