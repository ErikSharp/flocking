import { Drawable } from "./drawable";
import { Updatable } from "./updatable";
import p5, { Vector } from "p5";
import { Environment } from "./environment";

export class Boid implements Drawable, Updatable {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    private readonly perceptionRadiusStart = 50;
    private perceptionRadius = 50;
    private readonly maxForce = 0.2;
    private readonly maxSpeed = 4;

    constructor(private p: p5, private env: Environment) {
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
        let steering = this.p.createVector();
        let total = 0;

        for (const other of boids) {
            let dist = this.p.dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && dist < this.perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    private cohesion(boids: Boid[]) {
        let steering = this.p.createVector();
        let total = 0;

        for (const other of boids) {
            let dist = this.p.dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && dist < this.perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    private separation(boids: Boid[]) {
        let steering = this.p.createVector();
        let total = 0;

        for (const other of boids) {
            let dist = this.p.dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && dist < this.perceptionRadius) {
                let diff = Vector.sub(this.position, other.position);
                diff.div(dist);
                steering.add(diff);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    flock(boids: Boid[]) {
        this.acceleration.mult(0);
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        alignment.mult(this.env.alignScale);
        cohesion.mult(this.env.cohesionScale);
        separation.mult(this.env.separationScale);
        this.perceptionRadius =
            this.perceptionRadiusStart * this.env.perceptionScale;

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    update(): void {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);

        this.edges();
    }

    draw(): void {
        this.p.noFill();
        this.p.push();
        this.p.strokeWeight(1);
        this.p.stroke(200);
        this.p.translate(this.position.x, this.position.y);
        this.p.rotate(this.velocity.heading() + this.p.HALF_PI);
        this.p.triangle(0, 0, 7, 20, -7, 20);
        this.p.pop();
        this.p.strokeWeight(1);
        this.p.stroke(20);
        this.p.ellipseMode(this.p.CENTER);
        this.p.ellipse(this.position.x, this.position.y, this.perceptionRadius);
    }
}
