const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [1400, 400],
  pixelsPerInch: 72,
};

const sketch = () => {
  const colorCount = random.rangeFloor(2, 3);
  function generate_random_string(string_length) {
    let random_string = '';
    let random_ascii;
    let ascii_low = 65;
    let ascii_high = 90
    for (let i = 0; i < string_length; i++) {
      random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
      random_string += String.fromCharCode(random_ascii)
    }
    return random_string
  }

  const createGrid = (count) => {
    const palette = random.shuffle(random.pick(palettes).slice(0, 3)).slice(0, colorCount);
    const points = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        // guard against NaN if count is 1
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * random.range(.02, .035);
        points.push(
          {
            color: random.pick(palette),
            radius: radius,
            rotation: random.noise2D(u, v) * random.rangeFloor(2, 3),
            position: [u, v]
          }
        )
      }
    }
    return points;
  }
  const points = createGrid(85).filter(() => random.value() > 0.5);
  const points2 = createGrid(950).filter(() => random.value() < 0.5);
  const points3 = createGrid(50);
  const margin = 0;
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const { position, radius, color, rotation } = data;
      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      let r = generate_random_string(1);

      context.save();
      context.translate(x, y);
      // context.fillStyle = color
      // context.font = `${radius * width}px sans-serif`;
      context.rotate(rotation);
      // context.fillText(r, x, y);
      context.strokeStyle = color;
      context.beginPath();
      context.arc(0, 0, radius * 300, 0, Math.PI * 2, false);
      context.stroke();
      context.restore();
    });
    points2.forEach(data => {
      const { position, radius, color, rotation } = data;
      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      let r = generate_random_string(1);

      context.save();
      context.fillStyle = color
      context.lineWidth = random.rangeFloor(40, 50);
      context.font = `${radius * width}px sans-serif`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('•', x, y);
      context.restore();
    });
    points3.forEach(data => {
      const { position, radius, color, rotation } = data;
      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.save();
      context.strokeStyle = color
      context.lineWidth = random.rangeFloor(2, 4);
      context.translate(x, y);
      // create a circle
      context.beginPath();
      context.arc(0, 0, radius * 90, 0, Math.PI * 2, false);
      context.stroke();
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
