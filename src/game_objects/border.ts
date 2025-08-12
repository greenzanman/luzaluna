import type { Comp, Vec2, GameObj} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"
import {PlayerComp} from "./player"

interface BorderComp extends Comp {}

function borderComp(): BorderComp {
    return {
        id: "borderComp",
        require: ["pos", "rect", "outline", "color"],
    };
}

export function createBorder(position: Vec2, width: number, height:number, out:number): GameObj {
    return add([
    pos(position),
    rect(width, height, {fill: false}),
    outline(out),
    color(BLACK)
    ])
} 