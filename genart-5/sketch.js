const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [3200, 3200],
  pixelsPerInch: 300,
};

const sketch = () => {
  const colorCount = random.rangeFloor(1, 3);
  const palette = random.shuffle(random.pick(palettes).slice(0, 3)).slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = random.rangeFloor(500, 900);
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push(
          {
            color: random.pick(palette),
            radius: Math.abs(0.1 + random.gaussian() * .05),
            rotation: random.noise2D(u, v, .8, 4) * random.rangeFloor(1, 3),
            position: [u, v]
          }
        )
      }
    }
    return points;
  }
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 0;
  return ({ context, width, height }) => {
    context.fillStyle = random.pick(palette);
    // context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const { position, radius, color, rotation } = data;
      const [u, v] = position;
      context.save();
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      context.translate(x, y);
      context.rotate(rotation);

      context.strokeStyle = color;
      context.lineWidth = random.rangeFloor(1, 3);
      context.fillStyle = color;
      context.beginPath();

      if (random.value() > 0.1) {
        // draw a sound wave
        context.moveTo(x, y);
        context.lineTo(x + 50 + radius * 300 * Math.sin(u * Math.PI * 2), y + 50 + radius * 300 * Math.cos(u * Math.PI * 2));
        context.stroke();
      } else {
        // draw a circle
        context.beginPath();
        context.arc(x, y, radius * random.rangeFloor(70, 120), 0, 2 * Math.PI);
        context.fill();
        context.closePath();
      }
      context.restore();
    })
  }
}
canvasSketch(sketch, settings);
