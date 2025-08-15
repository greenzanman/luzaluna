import type { Comp, Vec2} from "kaplay";
import {POLLEN_SPEED} from "../main"

interface PollenComp extends Comp {
    xVel: number,
    yVel: number
}

function pollenComp(xVel: number, yVel: number): PollenComp {
    return {
        id: "pollenComp",
        require: ["pos"],
        xVel: xVel,
        yVel: yVel,
        update() {
            this.move(xVel * dt(), yVel * dt())
        }
    };
}

export function createPollen(position: Vec2, dir: Vec2) {
    let pollen = add([
        rect(6, 6),
        area(),
        anchor("center"),
        pos(position.x, position.y),
        color(220, 202, 105),
        pollenComp(dir.x * POLLEN_SPEED, dir.y * POLLEN_SPEED),
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
