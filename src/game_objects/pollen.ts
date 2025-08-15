import type { Comp, Vec2} from "kaplay";
import {POLLEN_SPEED} from "../main"

interface PollenComp extends Comp {
    velocity: Vec2
}

function pollenComp(newVelocity: Vec2): PollenComp {
    return {
        id: "pollenComp",
        require: ["pos"],
        velocity: newVelocity,
        update() {
            this.moveBy(this.velocity.scale(dt()))
        }
    };
}

export function createPollen(position: Vec2, vel: Vec2) {
    let pollen = add([
        rect(6, 6),
        area(),
        anchor("center"),
        pos(position.x, position.y),
        pollenComp(vel),
        "pollen"
    ]);

    pollen.onCollide("flower", () => {
        pollen.destroy();
    })
    pollen.onCollide("wasp", () => {
        pollen.destroy();
    })
    pollen.onCollide("bigWasp", () => {
        pollen.destroy();
    })
}
