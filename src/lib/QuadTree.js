// Taken from
// https://github.com/CodingTrain/QuadTree

export class Point {

    constructor(x, y, c) {
        this.x = x;
        this.y = y;
        this.c = c;
    }
}
export class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rSquared = this.r * this.r;
    }

    contains(point) {
        // check if the point is in the circle by checking if the euclidean distance of
        // the point and the center of the circle if smaller or equal to the radius of
        // the circle
        let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
        return d <= this.rSquared;
    }

    intersects(range) {

        var xDist = Math.abs(range.x - this.x);
        var yDist = Math.abs(range.y - this.y);

        // radius of the circle
        var r = this.r;

        var w = range.w;
        var h = range.h;

        var edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

        // no intersection
        if (xDist > (r + w) || yDist > (r + h))
            return false;

        // intersection within the circle
        if (xDist <= w || yDist <= h)
            return true;

        // intersection on the edge of the circle
        return edges <= this.rSquared;
    }
}
export class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return this.x <= point.x && point.x <= this.x + this.w &&
            this.y <= point.y && point.y <= this.y + this.h;
    }
    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h);
    }

    // a.left >= b.right || a.top >= b.bottom || 
    // a.right <= b.left || a.bottom <= b.top
}

export class QuadTree {
    constructor(boundary, n, ctx) {
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.divided = false;
        this.ctx = ctx
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;
        let ne = new Rectangle(x + w / 2, y, w / 2, h / 2);
        this.northeast = new QuadTree(ne, this.capacity, this.ctx);
        let nw = new Rectangle(x, y, w / 2, h / 2);
        this.northwest = new QuadTree(nw, this.capacity, this.ctx);
        let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southeast = new QuadTree(se, this.capacity, this.ctx);
        let sw = new Rectangle(x, y + h / 2, w / 2, h / 2);
        this.southwest = new QuadTree(sw, this.capacity, this.ctx);
        this.divided = true;
    }

    insert(point, l = ['root']) {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            if (this.northeast.insert(point, [...l, 'ne'])) {
                return true;
            } else if (this.northwest.insert(point, [...l, 'nw'])) {
                return true;
            } else if (this.southeast.insert(point, [...l, 'se'])) {
                return true;
            } else if (this.southwest.insert(point, [...l, 'sw'])) {
                return true;
            }
        }
    }

    query(range, found) {
        if (!found) {
            found = [];
        }
        if (!this.boundary.intersects(range)) {
            return;
        } else {
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
            if (this.divided) {
                this.northwest.query(range, found);
                this.northeast.query(range, found);
                this.southwest.query(range, found);
                this.southeast.query(range, found);
            }
        }
        return found;
    }


    show(grid = false) {
        const draw = (x, y, c, s) => {
            this.ctx.fillStyle = c;
            this.ctx.fillRect(x, y, s, s);
        };
        if (grid) {
            this.ctx.strokeStyle = "rgba(255,255,255,.1)";
            this.ctx.strokeRect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
        }

        for (let p of this.points) {
            draw(p.x, p.y, p.c, 2);

        }

        if (this.divided) {
            this.northeast.show(grid);
            this.northwest.show(grid);
            this.southeast.show(grid);
            this.southwest.show(grid);
        }
    }
}
