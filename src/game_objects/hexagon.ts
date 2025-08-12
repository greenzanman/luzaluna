import type { Comp, Vec2, GameObj} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH, HEXAGON_SIDE} from "../main"
import {PlayerComp} from "./player"

interface BorderComp extends Comp {}

function borderComp(): BorderComp {
    return {
        id: "borderComp",
        require: ["pos", "polygon", "outline", "color"],
    };
}

export function createHex(position: Vec2, width: number, height:number, out:number): GameObj {
    /** 
     * ***
     * ***
    */
    const myWidth = width / 3
    const myHeight = height / 2
    return add([
    borderComp(),
    pos(position),
    polygon([
        vec2(0, myHeight), 
        vec2(myWidth, myHeight * 2), 
        vec2(myWidth * 2, myHeight * 2), 
        vec2(myWidth * 3, myHeight), 
        vec2(myWidth * 2, 0), 
        vec2(myWidth, 0)
    ], {fill: false}),
    outline(out),
    color(RED)
    ])
} 