import p5 from "p5";
import { Drawable } from "./drawable";
import { Updatable } from "./updatable";
import { Boid } from "./boid";
import { Environment } from "./environment";
import { QuadTree } from "./QuadTreeComponents/quadTree";
import { Rectangle } from "./QuadTreeComponents/rectangle";

export class Sketch implements Drawable, Updatable {
    private updatables: Updatable[] = [];
    private drawables: Drawable[] = [];
    private boids: Boid[] = [];
    private tree: QuadTree<Boid>;
    private env: Environment;

    constructor(private p: p5) {
        p.createCanvas(innerWidth * 0.8, innerHeight * 0.8);
        this.env = new Environment(p);

        this.updatables.push(this.env);

        for (let i = 0; i < 100; i++) {
            var boid = new Boid(p, this.env);
            this.boids.push(boid);
            this.updatables.push(boid);
            this.drawables.push(boid);
        }
    }

    update() {
        this.tree = new QuadTree<Boid>(
            this.p,
            new Rectangle(0, 0, this.p.width, this.p.height),
            this.env.quadTreeCap
        );

        this.boids.forEach((b) => this.tree.insert(b));

        for (const boid of this.boids) {
            let closeBoids = this.tree.query(boid.getSearchRectangle());
            boid.flock(closeBoids);
        }
        this.updatables.forEach((u) => u.update());
    }

    draw() {
        this.p.background(0);
        this.tree.draw();
        this.drawables.forEach((d) => d.draw());
    }
}
