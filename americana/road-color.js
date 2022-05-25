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

const roadHue = 0;
const tollRoadHue = 48;

const roadColor = hue => [
  {
    id: "motorway_toll",
    fill: [
      4, `hsl(${this.hue}, 70%, 76%)`,
      6, `hsl(${this.hue}, 70%, 66%)`,
      minzoomBrunnel - 0.5, `hsl(${this.hue}, 70%, 60%)`,
      14, `hsl(${this.hue}, 71%, 45%)`,
    ],
    casing: "motorway",
    surface: `hsl(${this.hue}, 50%, 70%)`,
  },
  {
    id: "motorway",
    fill: [
      4, `hsl(${hue}, 70%, 76%)`,
      6, `hsl(${hue}, 70%, 66%)`,
      minzoomBrunnel - 0.5, `hsl(${hue}, 70%, 60%)`,
      14, `hsl(${hue}, 71%, 35%)`,
    ],
    casing: [
      4, `hsl(${hue}, 10%, 85%)`,
      6, `hsl(${hue}, 60%, 50%)`,
      minzoomBrunnel - 0.5, `hsl(${hue}, 71%, 40%)`,
      14, `hsl(${hue}, 51%, 9%)`,
    ],
    surface: `hsl(${this.hue}, 50%, 70%)`,
  },
  {
    id: "trunk",
    fill: `hsl(${this.hue}, 77%, 50%)`,
    casing: [
      5, `hsl(${hue}, 77%, 50%)`,
      9, `hsl(${hue}, 77%, 50%)`,
      15, `hsl(${hue}, 70%, 18%)`,
    ],
    surface: `hsl(${this.hue}, 95%, 80%)`,
  },
];
