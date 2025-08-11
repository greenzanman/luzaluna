import type { Comp, Vec2, GameObj} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"
import {PlayerComp} from "./player"

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
    return add([
        rect(6, 6),
        area(),
        anchor("center"),
        pos(position.x, position.y),
        pollenComp(dir.x * POLLEN_SPEED, dir.y * POLLEN_SPEED),
        "pollen"
    ]);
}
