import p5 from "p5";
import { Drawable } from "./drawable";
import { Updatable } from "./updatable";
import { Boid } from "./boid";
import { Environment } from "./environment";

export class Sketch implements Drawable, Updatable {
    private updatables: Updatable[] = [];
    private drawables: Drawable[] = [];
    private boids: Boid[] = [];

    constructor(private p: p5) {
        p.createCanvas(innerWidth * 0.8, innerHeight * 0.8);
        let env = new Environment(p);

        for (let i = 0; i < 100; i++) {
            var boid = new Boid(p, env);
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
