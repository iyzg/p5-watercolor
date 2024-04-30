class Watercolor {
    constructor(x, y, r, n_sides, color) {
        this.angle = TWO_PI / n_sides;
        this.x = x;
        this.y = y;
        this.r = r;
        this.n_sides = n_sides;
        this.layers = [];
        this.color = color;

        this.base = [];

        for (let a = 0; a < TWO_PI; a += this.angle) {
            this.base.push([x + r * cos(a), y + r * sin(a)]);
        }
        this.layers.push(this.base);
    }

    create_poly_stack(k) {
        let num_bases = 3;
        let new_bases = [];

        // Create new bases
        for (let i = 0; i < num_bases; ++i) {
            let new_base;
            if (i == 0) {
                new_base = JSON.parse(JSON.stringify(this.layers[0]));
            } else {
                new_base = JSON.parse(JSON.stringify(new_bases[new_bases.length-1]));
            }

            new_bases.push(this.deform(new_base, 1, this.r / 10, 2));
        }


        for (let i = 0; i < k; ++i) {
            let deformations = floor(map(i, 0, k-1, 0, num_bases - 0.01));
            // console.log(i, deformations);
            let new_layer = JSON.parse(JSON.stringify(new_bases[deformations]));

            this.layers.push(this.deform(new_layer, 3, this.r / 15, 4));
        }
    }

    create_base_poly() {
        this.layers[0] = this.deform(this.layers[0], 3, this.r / 10, 2);
    }

    deform(points, depth, variance, vdiv) {
        // Loop through vertices
        // Deform outwards
        // this should be somewhat perpendicular, some slight slant
        // console.log(points, points.length);

        let new_points = [];

        for (let i = 0; i < points.length; ++i) {
            let [x1, y1] = points[i];
            let [x2, y2] = points[(i + 1) % points.length];
            
            // Move in between the points a little bit
            // let split = randomGaussian(0.5, 0.05);
            // let split = 0.5;
            // let xmid = (split * x1 + (1 - split) * x2);
            // let ymid = (split * y1 + (1 - split) * y2);

            // Get normal vector
            // let outward_vector = p5.Vector.sub(createVector(xmid, ymid), createVector(this.x, this.y)).normalize();

            // Do the random things now
            // This should have a div factor
            // let mag = max(0, randomGaussian(this.r, this.r / 3));
            // let mag = this.r / 2;
            // outward_vector.setMag(mag);
            // outward_vector.rotate(randomGaussian(0, 2));

            // let new_point = p5.Vector.add(createVector(xmid, ymid), outward_vector);

            new_points.push([x1, y1]);
            // new_points.push([new_point.x, new_point.y]);
            this.subdivide(new_points, x1, x2, y1, y2, depth, randomGaussian(variance, variance/2.5), vdiv);
        }

        // console.log(new_points);
        return new_points;
    }

    subdivide(new_points, x1, x2, y1, y2, depth, variance, vdiv) {
        // Move in between the points a little bit
        if (depth > 0) {
            // let split = randomGaussian(0.5, 0.05);
            let split = 0.5;
            let nx = (split * x1 + (1 - split) * x2);
            let ny = (split * y1 + (1 - split) * y2);

            nx = nx + randomGaussian() * variance;
            ny = ny + randomGaussian() * variance;

            //  Get normal vector
            // let outward_vector = p5.Vector.sub(createVector(xmid, ymid), createVector(this.x, this.y)).normalize();

            // Do the random things now
            // This should have a div factor
            // let mag = max(0, randomGaussian(this.r, this.r / 3));
            // let mag = this.r / 2;
            // outward_vector.setMag(mag);
            // outward_vector.rotate(randomGaussian(0, 2));
            // let new_point = p5.Vector.add(createVector(xmid, ymid), outward_vector);
            // let nx = new_point.x, ny = new_point.y;
            this.subdivide(new_points, x1, nx, y1, ny,
                depth - 1, variance/vdiv, vdiv);
            new_points.push([nx, ny]);
            this.subdivide(new_points, nx, x2, ny, y2,
                depth - 1, variance / vdiv, vdiv);
        }
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
        // fill('#CC533A', 0.05);
        // console.log(this.color);
        fill(this.color);
        // print(this.layers.length);
        for (let layer of this.layers) {
            beginShape();
            for (let [x, y] of layer) {
                vertex(x, y);
            }
            endShape();
        }
    }
}