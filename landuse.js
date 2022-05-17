export const landuseColors = {
  bus_station: "sandybrown",
  cemetery: "darkseagreen",
  college: "peachpuff",
  commercial: "mistyrose",
  dam: "slategray",
  grass: "lawngreen",
  hospital: "lightpink",
  industrial: "thistle",
  military: "tan",
  neighbourhood: "gainsboro",
  pitch: "greenyellow",
  playground: "gold",
  quarter: "gainsboro",
  railway: "mediumorchid",
  recreation_ground: "mediumspringgreen",
  residential: "gainsboro",
  retail: "moccasin",
  school: "bisque",
  stadium: "mediumseagreen",
  suburb: "gainsboro",
  theme_park: "orange",
  track: "lightsalmon",
  university: "peachpuff",
  zoo: "goldenrod",
};

export const landcoverColors = {
  allotments: "lawngreen",
  beach: "lightgoldenrodyellow",
  farm: "lemonchiffon",
  farmland: "cornsilk",
  forest: "darkgreen",
  garden: "greenyellow",
  glacier: "mediumturquoise",
  golf_course: "mediumseagreen",
  grass: "lawngreen",
  grassland: "lawngreen",
  heath: "khaki",
  meadow: "lawngreen",
  orchard: "khaki",
  park: "lightgreen",
  plant_nursery: "darkseagreen",
  recreation_ground: "mediumspringgreen",
  saltmarsh: "teal",
  sand: "navajowhite",
  scree: "lightgrey",
  scrub: "lemonchiffon",
  village_green: "lawngreen",
  vineyard: "plum",
  wetland: "teal",
  wood: "darkgreen",
};

export const makeColorMatcher = (spec, property, fallback) => [
  "match",
  ["get", property],
  ...Object.entries(spec).flat(),
  fallback,
];

const landcoverFilter = ["all"];

const landuseFilter = ["all"];

export const landcoverGeneric = {
  id: "landcover-generic",
  type: "fill",
  source: "openmaptiles",
  "source-layer": "landcover",
  filter: landcoverFilter,
  paint: {
    "fill-color": makeColorMatcher(landcoverColors, "subclass", "fuchsia"),
    "fill-opacity": 0.5,
  },
};

export const landuseGeneric = {
  id: "landuse-generic",
  type: "fill",
  source: "openmaptiles",
  "source-layer": "landuse",
  filter: landuseFilter,
  paint: {
    "fill-color": makeColorMatcher(landuseColors, "class", "orangered"),
    "fill-opacity": 0.5,
  },
};

export const landcoverOutlineGeneric = {
  id: "landcover-outline-generic",
  type: "line",
  source: "openmaptiles",
  "source-layer": "landcover",
  filter: landcoverFilter,
  paint: {
    "line-color": makeColorMatcher(landcoverColors, "subclass", "fuchsia"),
  },
};

export const parkFill = {
  id: "park-fill",
  type: "fill",
  source: "openmaptiles",
  "source-layer": "park",
  paint: {
    "fill-color": "green",
    "fill-opacity": 0.5,
  },
};

export const parkOutline = {
  id: "park-outline",
  type: "line",
  source: "openmaptiles",
  "source-layer": "park",
  paint: {
    "line-color": "green",
  },
};

export const landuseOutlineGeneric = {
  id: "landuse-outline-generic",
  type: "line",
  source: "openmaptiles",
  "source-layer": "landuse",
  filter: landuseFilter,
  paint: {
    "line-color": makeColorMatcher(landuseColors, "class", "fuchsia"),
  },
};

export const aerowayFill = {
  id: "aeroway-fill",
  type: "fill",
  source: "openmaptiles",
  "source-layer": "aeroway",
  filter: ["in", ["geometry-type"], ["literal", ["Polygon", "MultiPolygon"]]],
  paint: {
    "fill-color": "lightsteelblue",
    "fill-opacity": 0.5,
  },
};

export const aerowayOutline = {
  id: "aeroway-outline",
  type: "line",
  source: "openmaptiles",
  "source-layer": "aeroway",
  filter: ["in", ["geometry-type"], ["literal", ["Polygon", "MultiPolygon"]]],
  paint: {
    "line-color": "lightsteelblue",
  },
};

export const aerowayLine = {
  id: "aeroway-line",
  type: "line",
  source: "openmaptiles",
  "source-layer": "aeroway",
  filter: [
    "in",
    ["geometry-type"],
    ["literal", ["LineString", "MultiLineString"]],
  ],
  paint: {
    "line-color": "lightsteelblue",
    "line-width": [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      10,
      1,
      13,
      ["match", ["get", "class"], "runway", 5, 2],
    ],
  },
};

export const waterFill = {
  "id": "water-fill",
  "type": "fill",
  "source": "openmaptiles",
  "source-layer": "water",
  "paint": {
    "fill-color": "lightskyblue",
    "fill-opacity": 0.5,
  },
};

export const waterOutline = {
  "id": "water-outline",
  "type": "line",
  "source": "openmaptiles",
  "source-layer": "water",
  "paint": {
    "line-color": "lightskyblue",
  },
};
