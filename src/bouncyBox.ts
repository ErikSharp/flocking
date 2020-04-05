import p5, { Vector } from "p5";
import { Drawable } from "./drawable";
import { Updatable } from "./updatable";

export class BouncyBox implements Drawable, Updatable {
    pos: Vector;
    vel: Vector;
    color: string;
    static colors: string[] = ["white", "red", "blue", "green", "magenta"];

    constructor(private p: p5) {
        this.pos = new Vector();
        this.pos.x = p.width / 2;
        this.pos.y = p.height / 2;

        this.vel = Vector.random2D();
        this.vel.setMag(this.p.random(1, 6));
        this.color = this.p.random(BouncyBox.colors);
    }

    update() {
        if (this.pos.x < 0 || this.pos.x > this.p.width) {
            this.vel.x *= -1;
        }

        if (this.pos.y < 0 || this.pos.y > this.p.height) {
            this.vel.y *= -1;
        }

        this.pos.add(this.vel);
    }

    draw() {
        this.p.fill(this.color);
        this.p.rectMode(this.p.CENTER);
        this.p.rect(this.pos.x, this.pos.y, 20, 20);
    }
}
