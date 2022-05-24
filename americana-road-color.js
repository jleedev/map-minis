// entirely termporary

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
