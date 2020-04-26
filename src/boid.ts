import { Drawable } from "./drawable";
import { Updatable } from "./updatable";
import p5, { Vector } from "p5";
import { Environment } from "./environment";

export class Boid implements Drawable, Updatable {
    position: Vector;
    velocity: Vector;
    private acceleration: Vector;
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

    flock(boids: Boid[]) {
        this.acceleration.mult(0);
        this.perceptionRadius =
            this.perceptionRadiusStart * this.env.perceptionScale;

        let alignment = this.p.createVector();
        let alignTotal = 0;
        let cohesion = this.p.createVector();
        let cohesionTotal = 0;
        let separation = this.p.createVector();
        let separationTotal = 0;

        for (const other of boids) {
            let dist = this.p.dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && dist < this.perceptionRadius) {
                //align
                alignment.add(other.velocity);
                alignTotal++;

                //cohesion
                cohesion.add(other.position);
                cohesionTotal++;

                //separation
                let diff = Vector.sub(this.position, other.position);
                diff.div(dist);
                separation.add(diff);
                separationTotal++;
            }
        }

        if (alignTotal) {
            alignment.div(alignTotal);
            alignment.setMag(this.maxSpeed);
            alignment.sub(this.velocity);
            alignment.limit(this.maxForce);
            alignment.mult(this.env.alignScale);
        }

        if (cohesionTotal) {
            cohesion.div(cohesionTotal);
            cohesion.sub(this.position);
            cohesion.setMag(this.maxSpeed);
            cohesion.sub(this.velocity);
            cohesion.limit(this.maxForce);
            cohesion.mult(this.env.cohesionScale);
        }

        if (separationTotal) {
            separation.div(separationTotal);
            separation.setMag(this.maxSpeed);
            separation.sub(this.velocity);
            separation.limit(this.maxForce);
            separation.mult(this.env.separationScale);
        }

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
