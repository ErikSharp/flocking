import { Drawable } from "./drawable";
import { Updatable } from "./updatable";
import p5, { Vector } from "p5";

export class Boid implements Drawable, Updatable {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    private readonly maxForce = 0.05;

    constructor(private p: p5) {
        this.position = p.createVector(p.random(p.width), p.random(p.height));
        this.velocity = Vector.random2D();
        this.velocity.setMag(p.random(2, 4));
        this.acceleration = p.createVector();
    }

    private edges() {
        if (this.position.x > this.p.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = this.p.width;
        }

        if (this.position.y > this.p.height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = this.p.height;
        }
    }

    private align(boids: Boid[]) {
        let perceptionRadius = 50;

        let steering = this.p.createVector();
        let total = 0;

        for (const other of boids) {
            let dist = this.p.dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && dist < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    flock(boids: Boid[]) {
        let alignment = this.align(boids);
        this.acceleration = alignment;
    }

    update(): void {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);

        this.edges();
    }

    draw(): void {
        this.p.strokeWeight(8);
        this.p.stroke(255);
        this.p.point(this.position.x, this.position.y);
    }
}
