// Functions to evaluate exponential interpolation at a given stop, and
// to unify a stack of interpolation definitions to all have the same
// labels.

import { zip } from "./utils.js";

export const getStopLabels = (stops) => stops.flatMap((x, i) => i % 2 == 0 ? [x] : []);
export const getStopValues = (stops) => stops.flatMap((x, i) => i % 2 == 1 ? [x] : []);

export const unflat = (stops) => [...zip(getStopLabels(stops), getStopValues(stops))];

const terpNumber = (a, b, t) => (a * (1 - t)) + (b * t);

const terpValue = (a, b, t) => {
  if (typeof a != typeof b) {
    throw new TypeError(`${typeof a} != ${typeof b}`);
  }
  if (typeof a == 'number') {
    return terpNumber(a, b, t);
  } else if (typeof a == 'string' && a.startsWith('hsl(') && b.startsWith('hsl(')) {
    const hslRe = /hsl\((.*), (.*)%, (.*)%\)/;
    const [ha, sa, la] = a.match(hslRe).slice(1).map(Number);
    const [hb, sb, lb] = a.match(hslRe).slice(1).map(Number);
    const ht = terpNumber(ha, hb, t);
    const st = terpNumber(sa, sb, t);
    const lt = terpNumber(la, lb, t);
    return `hsl(${ht}, ${st}%, ${lt}%)`;
  } else {
    throw new TypeError();
  }
};

const exponentialInterpolation = (input, base, lower, upper) => {
  const difference = upper - lower;
  const progress = input - lower;
  if (difference == 0) {
    return 0;
  } else if (base == 1) {
    return progress / difference;
  } else {
    return ((base ** progress) - 1) / ((base ** difference) - 1);
  }
};

const evaluateExponential = (stops, base, input) => {
  const labels = getStopLabels(stops);
  const values = getStopValues(stops);
  if (input <= labels[0]) {
    return values[0];
  } else if (input >= labels[values.length - 1]) {
    return values[values.length - 1];
  } else {
    const i = findStopLessThanOrEqualTo(labels, input);
    const lower = labels[i];
    const upper = labels[i + 1];
    const t = exponentialInterpolation(input, base, lower, upper);
    return terpValue(values[i], values[i + 1], t);
  }
};

const addInterpolationStops = (stops, base, labels) => {
  const lookup = Object.fromEntries(unflat(stops));
  const output = labels.map(input => {
    if (input in lookup) {
      return [input, lookup[input]];
    } else {
      const val = evaluateExponential(stops, base, input);
      return [input, val];
    }
  });
  output.sort((a, b) => a[0] - b[0]);
  /*
  for (let i = 0; i < output.length; i++) {
    // XXX
    if (Number.isNaN(output[i][1])) {
      output[i][1] = 'lime';
    }
  }
  */
  return output.flat();
};

export const unionInterpolationStops = (obj_list, base) => {
  // [{ id, stops }]
  const allLabels = [...new Set(obj_list.flatMap(obj => getStopLabels(obj.stops)))].sort((a, b) => a - b);
  return [obj_list.map(obj => ({
      id: obj.id,
      stops: addInterpolationStops(obj.stops, base, allLabels),
    })), allLabels];
};

const findStopLessThanOrEqualTo = (stops, input) => {
  const lastIndex = stops.length - 1;
  let lowerIndex = 0;
  let upperIndex = lastIndex;
  let currentIndex = 0;
  let currentValue, nextValue;

  while (lowerIndex <= upperIndex) {
    currentIndex = Math.floor((lowerIndex + upperIndex) / 2);
    currentValue = stops[currentIndex];
    nextValue = stops[currentIndex + 1];

    if (currentValue <= input) {
      if (currentIndex === lastIndex || input < nextValue) { // Search complete
        return currentIndex;
      }

      lowerIndex = currentIndex + 1;
    } else if (currentValue > input) {
      upperIndex = currentIndex - 1;
    } else {
      throw new TypeError('Input is not a number.');
    }
  }

  return 0;
};

