import type { Comp, Vec2, GameObj} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"

interface PollenComp extends Comp {
    xVel: number,
    yVel: number
}

function pollenComp(vel: Vec2): PollenComp {
    return {
        id: "pollenComp",
        require: ["pos"],
        xVel: vel.x,
        yVel: vel.y,
        update() {
            this.move(vel.scale(dt()))
        }
    };
}

export function createPollen(position: Vec2, dir: Vec2, speed_offset: number) {
    let pollen = add([
        rect(6, 6),
        area(),
        anchor("center"),
        pos(position.x, position.y),
        pollenComp(dir.scale(POLLEN_SPEED + speed_offset)),
        "pollen"
    ]);

    pollen.onCollide("flower", () => {
        pollen.destroy();
    })
}
