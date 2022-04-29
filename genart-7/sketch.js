const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  units: "in",
  dimensions: [65, 40],
  pixelsPerInch: 300,
  encoding: "image/jpeg",
};

// const settings = {
//   units: "px",
//   dimensions: [2048, 2048],
//   pixelsPerInch: 72,
// };

const sketch = () => {
  random.setSeed(random.getRandomSeed());
  console.log("seed", random.getSeed());
  const colorCount = random.rangeFloor(2, 20);
  const palette = random
    .shuffle(random.pick(palettes).slice(0, 100))
    .slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = 50;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push({
          color: "white",
          // radius: Math.abs(random.noi`se`2D(u, v, .1, 0.05) + 0.01),
          radius: Math.abs(random.gaussian(0.008, 0.01)),
          rotation: random.gaussian(0, 2),
          position: [u, v],
        });
      }
    }
    return points;
  };

  const points = createGrid();
  const margin = 0;
  return ({ context, width, height }) => {
    context.fillStyle = random.pick(palette);
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { position, radius, color, rotation } = data;
      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      const translation = random.noise2D(x, y, 1, 0.005);
      context.save();
      context.fillStyle = random.pick(palette);
      context.strokeStyle = color;
      // randomly decide between circle, triangle, and hexagon
      const shape = random.pick(["circle", "triangle", "hexagon"]);
      context.translate(x, y);
      context.rotate(rotation);
      context.translate(-x, -y);
      context.translate(x, y);
      context.beginPath();
      context.lineWidth = (radius * width) / random.rangeFloor(10, 20);
      if (shape === "circle") {
        context.arc(x, y, radius * width, 0, Math.PI * 2);
      } else if (shape === "triangle") {
        context.moveTo(x, y - radius * width);
        context.lineTo(x + radius * width, y + radius * width);
        context.lineTo(x - radius * width, y + radius * width);
        context.lineTo(x, y - radius * width);
      } else if (shape === "hexagon") {
        context.moveTo(x, y - radius * width);
        context.lineTo(x + radius * width, y);
        context.lineTo(x + radius * width, y + radius * width);
        context.lineTo(x, y + radius * width * 2);
        context.lineTo(x - radius * width, y + radius * width);
        context.lineTo(x - radius * width, y);
        context.lineTo(x, y - radius * width);
      }
      context.fill();
      context.stroke();
      context.restore();

      return [{ data: context.canvas, extension: "jpeg" }];
    });
  };
};

canvasSketch(sketch, settings);
