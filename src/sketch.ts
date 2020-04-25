import p5 from "p5";
import { Drawable } from "./drawable";
import { Updatable } from "./updatable";
import { Boid } from "./boid";

export class Sketch implements Drawable, Updatable {
    updatables: Updatable[] = [];
    drawables: Drawable[] = [];
    boids: Boid[] = [];

    constructor(private p: p5) {
        p.createCanvas(innerWidth * 0.8, innerHeight * 0.8);

        for (let i = 0; i < 100; i++) {
            var boid = new Boid(p);
            this.boids.push(boid);
            this.updatables.push(boid);
            this.drawables.push(boid);
        }
    }

    update() {
        for (const boid of this.boids) {
            boid.flock(this.boids);
        }
        this.updatables.forEach((u) => u.update());
    }

    draw() {
        this.p.background(0);
        this.drawables.forEach((d) => d.draw());
    }
}
