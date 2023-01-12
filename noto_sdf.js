import OpenType from "https://unpkg.com/opentype.js?module";
import * as d3 from "https://unpkg.com/d3-fetch?module";
import calcSdf from "https://esm.run/bitmap-sdf";

const notoemojiRegular = await d3.buffer("NotoEmoji-Regular.ttf");
const font = OpenType.parse(notoemojiRegular);

const getGlyph = (name, size = 40) => {
  const glyph = font.nameToGlyph(name);
  let buffer = 5;
  let { x1, y1, x2, y2 } = glyph.getBoundingBox();
  let [w, h] = [x2 - x1, y2 - y1];
  let t = size ? Math.max(w, h) / size : 1;
  let canvas = document.createElement("canvas");
  canvas.width = w / t + buffer * 2;
  canvas.height = h / t + buffer * 2;
  let ctx = canvas.getContext("2d");
  ctx.translate(buffer, buffer);
  ctx.scale(1 / t, 1 / t);
  ctx.translate(-x1, y2);
  glyph.draw(ctx, 0, 0, font.unitsPerEm);
  return ctx.canvas;
};

const getSdf = name => {
  let canvas = getGlyph(name);
  let distances = calcSdf(canvas, { channel: 3 });
  // float to alpha, fully white
  let buf = Uint32Array.from(distances, (d) => ((d * 255) << 24) | 0xffffff).buffer;
  return new ImageData(new Uint8ClampedArray(buf), canvas.width, canvas.height);
}

export { getSdf };
