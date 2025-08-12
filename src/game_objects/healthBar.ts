import type { Comp, Vec2, GameObj, Color} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH, HEALTH_CAPACITY} from "../main"

interface HealthBarComp extends Comp {}

function healthBarComp(): HealthBarComp {
    return {
            id: "healthBarComp",
            require: ["pos"],
        }
}

export function createHealthBar(xPos: number, yPos: number, heart_size: number, border: GameObj): GameObj {
    return border.add([
        pos(xPos, yPos),
        rect(heart_size * HEALTH_CAPACITY, heart_size),
        anchor("botleft"),
        healthBarComp(),
        opacity(0),
        "healthBar"
    ]);
}