const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [1400, 400],
  pixelsPerInch: 300,
};

const sketch = () => {
  const colorCount = 7;
  const palette = random.shuffle(random.pick(palettes).slice(0, 9).slice(0, colorCount));

  const createGrid = () => {
    const points = [];
    const count = random.rangeFloor(50, 85);
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const radius = Math.abs(0.005 + random.gaussian() * random.range(.002, .005));
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push(
          {
            color: random.pick(palette),
            radius: radius,
            position: [u, v]
          }
        )
      }
    }
    return points;
  }
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 300;


  return ({ context, width, height }) => {
    context.fillStyle = random.pick(palette);
    // context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const { position, radius, color } = data;
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      const offsetCoordinate = (c) => {
        return lerp(c + random.range(.003, .008), c - random.range(0.003, 0.008), c);
      }

      const circle = () => {
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = 2
        context.arc(x, y, radius * width, 0, Math.PI * 2, true);
        context.fillStyle = color
        if (random.value() > .2) {
          context.fill();
        } else {
          context.stroke();
        }
      }

      const triangle = () => {
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = 2
        context.moveTo(x, y);
        context.lineTo(offsetCoordinate(x + radius * random.value() * 5 * width), offsetCoordinate(y + radius * random.value() * 5 * width));
        context.lineTo(offsetCoordinate(x - radius * random.value() * 5 * width), offsetCoordinate(y + radius * random.value() * 5 * width));
        context.lineTo(x, y);
        context.fillStyle = color
        if (random.value() > .2) {
          return context.fill();
        }
        return context.stroke();
      }

      const polygon = () => {
        // create an icosahedron that starts at x and y
        // and has a radius of radius
        // and a color of color
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = 2
        context.moveTo(x, y);
        context.lineTo(offsetCoordinate(x + radius * random.value() * random.range(1, 10) * width), offsetCoordinate(y + radius * random.value() * random.range(2, 10) * width));
        context.lineTo(offsetCoordinate(x - radius * random.value() * random.range(1, 10) * width), offsetCoordinate(y + radius * random.value() * random.range(2, 10) * width));
        context.lineTo(offsetCoordinate(x - radius * random.value() * random.range(1, 10) * width), offsetCoordinate(y + radius * random.value() * random.range(2, 10) * width));
        context.lineTo(offsetCoordinate(x + radius * random.value() * random.range(1, 10) * width), offsetCoordinate(y + radius * random.value() * random.range(2, 10) * width));
        context.lineTo(offsetCoordinate(x + radius * random.value() * random.range(1, 10) * width), offsetCoordinate(y - radius * random.value() * random.range(2, 10) * width));
        context.lineTo(offsetCoordinate(x - radius * random.value() * random.range(1, 10) * width), offsetCoordinate(y - radius * random.value() * random.range(2, 10) * width));
        context.lineTo(offsetCoordinate(x - radius * random.value() * random.range(1, 10) * width), offsetCoordinate(y + radius * random.value() * random.range(2, 10) * width));
        context.lineTo(x, y);
        context.fillStyle = color
        if (random.value() > .2) {
          return context.fill();
        }
        return context.stroke();
      }

      const square = () => {
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = 2
        context.moveTo(x - radius * width * random.range(.1, .5), y - radius * width * random.range(.1, .5));
        context.lineTo(x + radius * width * random.range(.1, .5), y - radius * width * random.range(.1, .5));
        context.lineTo(x + radius * width * random.range(.1, .5), y + radius * width * random.range(.1, .5));
        context.lineTo(x - radius * width * random.range(.1, .5), y + radius * width * random.range(.1, .5));
        context.lineTo(x - radius * width * random.range(.1, .5), y - radius * width * random.range(.1, .5));
        context.fillStyle = color
        if (random.value() > .2) {
          return context.fill();
        }
        return context.stroke();
      }


      let shapeRandom = random.value()
      if (shapeRandom > .1 && shapeRandom < .8) {
        circle();
      } else if (shapeRandom > .8 && shapeRandom < .99) {
        polygon();
      } else if (shapeRandom > .99 && shapeRandom < 1) {
        triangle();
      }
      square()
    });
  };
};

canvasSketch(sketch, settings);
