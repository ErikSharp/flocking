import p5, { Color } from "p5";
import { Updatable } from "./updatable";

export class Environment {
    private alignSlider: p5.Element;
    private alignLabel: p5.Element;

    private cohesionSlider: p5.Element;
    private cohesionLabel: p5.Element;

    private separationSlider: p5.Element;
    private separationLabel: p5.Element;

    private perceptionSlider: p5.Element;
    private perceptionLabel: p5.Element;

    constructor(private p: p5) {
        let controls = p.createDiv();
        controls.class("controls");

        let alignGroup = p.createDiv();
        alignGroup.class("control-group");
        let cohesionGroup = p.createDiv();
        cohesionGroup.class("control-group");
        let separationGroup = p.createDiv();
        separationGroup.class("control-group");
        let perceptionGroup = p.createDiv();
        perceptionGroup.class("control-group");

        controls.child(alignGroup);
        controls.child(cohesionGroup);
        controls.child(separationGroup);
        controls.child(perceptionGroup);

        alignGroup.child(p.createP("Align Scaler"));
        this.alignSlider = p.createSlider(0, 5, 1, 0.1);
        alignGroup.child(this.alignSlider);
        this.alignLabel = p.createP("100%");
        alignGroup.child(this.alignLabel);

        cohesionGroup.child(p.createP("Cohesion Scaler"));
        this.cohesionSlider = p.createSlider(0, 5, 1, 0.1);
        cohesionGroup.child(this.cohesionSlider);
        this.cohesionLabel = p.createP("100%");
        cohesionGroup.child(this.cohesionLabel);

        separationGroup.child(p.createP("Separation Scaler"));
        this.separationSlider = p.createSlider(0, 5, 1, 0.1);
        separationGroup.child(this.separationSlider);
        this.separationLabel = p.createP("100%");
        separationGroup.child(this.separationLabel);

        perceptionGroup.child(p.createP("Perception Scaler"));
        this.perceptionSlider = p.createSlider(0, 5, 1, 0.1);
        perceptionGroup.child(this.perceptionSlider);
        this.perceptionLabel = p.createP("100%");
        perceptionGroup.child(this.perceptionLabel);
    }

    get alignScale(): number {
        let value = +this.alignSlider.value();
        this.alignLabel.html(`${this.p.round(value * 100)}%`);
        return value;
    }

    get cohesionScale(): number {
        let value = +this.cohesionSlider.value();
        this.cohesionLabel.html(`${this.p.round(value * 100)}%`);
        return value;
    }

    get separationScale(): number {
        let value = +this.separationSlider.value();
        this.separationLabel.html(`${this.p.round(value * 100)}%`);
        return value;
    }

    get perceptionScale(): number {
        let value = +this.perceptionSlider.value();
        this.perceptionLabel.html(`${this.p.round(value * 100)}%`);
        return value;
    }
}
