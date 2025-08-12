import type { Comp, Vec2, GameObj } from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_CAPACITY, HEALTH_CAPACITY} from "../main"


export interface ArrowComp extends Comp {}

function arrowComp(player: GameObj): ArrowComp {
    return {
        id: "ArrowComp",
        draw() {
            mousePos().sub(player.worldPos()).unit()
            this.angle = mousePos().sub(player.worldPos()).unit().angle() - 90
        },
    }
}

export function createArrow(player: GameObj): GameObj{
    player.add([
        arrowComp(player),
        area(),
        rect(5, 60),
        pos(0, 0),
        color(RED),
        "arrow"
    ]);

    return player.get("arrow")[0]
}