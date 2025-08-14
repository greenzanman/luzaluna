import type { Comp, Vec2, GameObj, Color} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH, HEALTH_CAPACITY} from "../main"

interface HealthBarComp extends Comp {}

function healthBarComp(): HealthBarComp {
    return {
            id: "healthBarComp",
            require: ["pos"],
        }
}

export function createHealthBar(xPos: number, yPos: number, heart_size: number): GameObj {
    return add([
        pos(xPos, yPos),
        rect(heart_size * HEALTH_CAPACITY, heart_size),
        healthBarComp(),
        opacity(0),
        "healthBar"
    ]);
}