
// At this zoom, render switches from unified to differentiated
// bridge/tunnel rendering
export const minzoomBrunnel = 11;

// Exponent base for zoom interpolation
export const roadExp = 1.2;

export const highwayClasses = ["motorway", "trunk", "primary", "secondary", "tertiary", "minor", "service"];

export const highwayFilter = ["in", ["get", "class"], ["literal", highwayClasses]];

export const buildCase = (id) => {
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

