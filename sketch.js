let watercolor;
let watercolors = [];

function setup() {
  createCanvas(800, 400);
  // angleMode(DEGREES);
  watercolors.push(new Watercolor(width / 2, -width, width, 10, 'rgba(214, 226, 234, 0.04)'));
  // watercolors.push(new Watercolor(width / 2, height/2, width/3, 10, 'rgba(238, 205, 216, 0.04)'));
  // watercolors.push(new Watercolor(3 * width / 4, height/2, height/5, 10, 'rgba(237, 191, 218, 0.04)'));
  watercolors.push(new Watercolor(width / 2, height + width, width, 10, 'rgba(237, 191, 218, 0.04)'));
  // watercolors.push(new Watercolor(3 * width / 4, height/2, height/5, 10, 'rgba(28, 142, 230, 0.04)'));
  // watercolors.push(new Watercolor(width / 4, height/2, height/5, 10, 'rgba(204, 83, 58, 0.045)'));
  // watercolors.push(new Watercolor(width / 2, height/2, height/5, 10, 'rgba(215, 86, 87, 0.04)'));

  for (let watercolor of watercolors) {
    watercolor.test_deform();
    // watercolor.create_base_poly();
    // watercolor.create_poly_stack(100);
  }
}

function draw() {
  background('#F9F8F3');
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
  // watercolor.render();
  noLoop();
}
