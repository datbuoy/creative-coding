const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  units: 'in',
  dimensions: [24, 36],
  pixelsPerInch: 300,
  orientation: 'landscape'
};

/**
 * Seeds:
 * 884027
 * 637327
 * 801235
 * 377623
 */

const colorCount = 4
const palette = random.pick(random.shuffle(palettes.slice(0, 5))).slice(0, colorCount);
const sketch = () => {
  const seed = random.getRandomSeed();
  random.setSeed(seed);
  console.log(seed);
  const count = 30;
  const createGrid = () => {
    const points = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const color = random.pick(palette);
        points.push({
          position: [u, v],
          color: color,
          colorStop: palette[palette.findIndex(c => c.hex === color.hex) + 1],
        });
      }
    }
    return points;
  }

  const points = createGrid()
  const margin = 0;
  return ({ context, width, height }) => {
    context.fillStyle = random.pick(palette)
    context.fillRect(0, 0, width, height);

    points.forEach((data, i) => {
      const { position, color, colorStop } = data;
      const [u, v] = position;
      const range = 2;
      const index = random.rangeFloor(i, i + range > points.length - 1 ? i - range : i + range);
      const index2 = random.rangeFloor(i, i + range > points.length - 1 ? i - range : i + range);
      debugger;
      const [u2, v2] = points[index].position;
      const [u3, v3] = points[index2].position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      const x2 = lerp(margin, width - margin, u2)
      const y2 = lerp(margin, height - margin, v2)
      const x3 = lerp(margin, width - margin, u3);
      const y3 = lerp(margin, height - margin, v3);

      const grd = context.createLinearGradient(x, y, x2, y2);
      grd.addColorStop(0, color);
      grd.addColorStop(1, colorStop);
      debugger;

      context.beginPath();
      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = random.range(.05, .1);
      // draw a line to two random points in array points
      context.moveTo(x, y);
      context.lineTo(x2, y2);
      context.lineTo(x3, y3);
      // context.stroke();
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
