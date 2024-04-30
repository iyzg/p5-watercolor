class Watercolor {
    constructor(x, y, r, n_sides, color) {
        this.angle = TWO_PI / n_sides;
        this.x = x;
        this.y = y;
        this.r = r;
        this.n_sides = n_sides;
        this.color = color;

        this.layers = [];
        this.variance_layers = [];

        let base = [];
        let variance = [];

        for (let a = 0; a < TWO_PI; a += this.angle) {
            base.push([x + r * cos(a), y + r * sin(a)]);
            variance.push(randomGaussian(1.0, 0.2));
        }
        this.layers.push(base);
        this.variance_layers.push(variance);
        print(this.layers[0]);
        print(this.variance_layers);
    }

    test_deform() {
        let base_idx = 0;
        let rounds = 3;
        let layers_per_round = 10;
        [this.layers[0], this.variance_layers[0]] = this.n_deform(this.layers[0], this.variance_layers[0], 1);
        for (let r = 0; r < rounds; ++r) {
            for (let l = 0; l < layers_per_round; ++l) {
                let [new_layer, new_var] = this.n_deform(this.layers[base_idx], this.variance_layers[base_idx], 3);
                this.layers.push(new_layer);
                this.variance_layers.push(new_var);
            }
            let [new_layer, new_var] = this.n_deform(this.layers[base_idx], this.variance_layers[base_idx], 2);
            this.layers.push(new_layer);
            this.variance_layers.push(new_var);
            base_idx = this.layers.length - 1;
        }
    }

    n_deform(points, variances, depth) {
        for (let i = 0; i < depth; ++i) {
            // print(`i: ${i}`);
            [points, variances] = this.deform(points, variances);
        }
        return [points, variances];
    }

    deform(points, variances) {
        // Loop through vertices
        // Deform outwards
        // this should be somewhat perpendicular, some slight slant
        let new_points = [];
        let new_variances = [];

        // print('PRINT POINTS');
        // print(points);
        // print('PRINT VARS');
        // print(variances);
        for (let i = 0; i < points.length; ++i) {
            let [x1, y1] = points[i];
            let [x2, y2] = points[(i + 1) % points.length];
            
            // Move in between the points a little bit
            let split = randomGaussian(0.5, 0.05);
            let xmid = (split * x1 + (1 - split) * x2);
            let ymid = (split * y1 + (1 - split) * y2);

            // Get normal vector
            // For this, take and rotate 90 degrees since first point is always
            // going to be to the right
            // NOTE TO SELF: Rotate goes counterclockwise
            let p1Vector = createVector(x1, y1)
            let p2Vector = createVector(x2, y2)
            let midVector = createVector(xmid, ymid);
            let diffVector = p5.Vector.sub(p1Vector, midVector);
            let edgeLen = p5.Vector.sub(p1Vector, p2Vector).mag();
            diffVector.rotate(randomGaussian(HALF_PI, HALF_PI/2));
            diffVector.setMag(max(0, randomGaussian(variances[i] * edgeLen / 3, variances[i] * edgeLen / 5)));

            let new_point = p5.Vector.add(midVector, diffVector);

            new_points.push([x1, y1]);
            new_points.push([new_point.x, new_point.y]);

            new_variances.push(variances[i]);
            new_variances.push(randomGaussian(variances[i], 0.02));
        }

        return [new_points, new_variances];
    }

    draw_layer(i) {
        strokeWeight(0);
        fill(this.color);
        beginShape();
        for (let [x, y] of this.layers[i]) {
            vertex(x, y);
        }
        endShape();
    }

    render() {
        strokeWeight(0);
        fill(this.color);
        for (let layer of this.layers) {
            beginShape();
            for (let [x, y] of layer) {
                vertex(x, y);
            }
            endShape();
        }
    }
}