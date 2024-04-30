let watercolor;
let watercolors = [];

function setup() {
  createCanvas(600, 850);
  watercolors.push(new Watercolor(width / 2, -width/2, height/random(1.3, 1.75), 10, 'rgba(214, 226, 234, 0.04)'));
  watercolors.push(new Watercolor(width / 2, height+width/2, height/(1.3, 1.75), 10, 'rgba(237, 191, 218, 0.04)'));

  for (let watercolor of watercolors) {
    watercolor.test_deform();
  }
}

function draw() {
  background('seashell');
  let max_layers = -1;
  for (let watercolor of watercolors) {
    max_layers = max(max_layers, watercolor.layers.length);
  }

  for (let i = 0; i < max_layers; ++i) {
    for (let watercolor of watercolors) {
      if (i < watercolor.layers.length) {
        watercolor.draw_layer(i);
      }
    }
  }
  grid();
  noLoop();
}

// STOLEN FROM @generativelight https://x.com/generativelight/status/1519762591903588357
function mousePressed() {
  saveCanvas('outputSave', 'png');
}

// CODE STOLEN FROM: https://sighack.com/post/generative-watercolor-in-processing
function grid() {
  let spacing = 5;
  for (let i = -width; i < height + width; i+=spacing) {
    stroke(255, random(0, 50));
    gridline(i, 0, i + height, height);
  }
  for (let i = height + width; i >= -width; i-=spacing) {
    stroke(255, random(0, 50));
    gridline(i, 0, i - height, height);
  }
}

function gridline(x1, y1, x2, y2) {
  let tmp;
  /* Swap coordinates if needed so that x1 <= x2 */
  if (x1 > x2) { tmp = x1; x1 = x2; x2 = tmp; tmp = y1; y1 = y2; y2 = tmp; }

  dx = x2 - x1;
  dy = y2 - y1;
  step = 1;

  if (x2 < x1)
    step = -step;

  sx = x1;
  sy = y1;
  for (let x = x1+step; x <= x2; x+=step) {
    let y = y1 + step * dy * (x - x1) / dx;
    strokeWeight(0.5 + map(noise(sx, sy), 0, 1, -0.5, 0.5));
    line(sx, sy, x + map(noise(x, y), 0, 1, -1, 1), y + map(noise(x, y), 0, 1, -1, 1));
    sx = x;
    sy = y;
  }
}