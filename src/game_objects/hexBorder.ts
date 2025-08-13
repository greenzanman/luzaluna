import type { Comp, Vec2, GameObj} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"
import {PlayerComp} from "./player"

interface HexBorderComp extends Comp {}

function hexBorderComp(): HexBorderComp {
    return {
        id: "borderComp",
        require: ["pos", "polygon"],
    };
}

export function createHexBorder(position: Vec2, width: number, height:number, out:number): GameObj {
    /** 
     * ***
     * ***
    */
    const x = width / (1 + Math.SQRT2)
    const myHeight = height / 2
    const points2 = [
        vec2(0, myHeight), 
        vec2(x/Math.SQRT2, myHeight * 2), 
        vec2(x/Math.SQRT2 + x, myHeight * 2), 
        vec2(2 * x/Math.SQRT2 + x, myHeight), 
        vec2(x/Math.SQRT2 + x, 0), 
        vec2(x/Math.SQRT2, 0)
    ]
    // WARNING: Is this necessary?
    onDraw(() => {
        drawPolygon({
            pts: points2,
            pos: position,
            fill: false, 
            outline: outline(out).outline
        })
    })

    const hex = add([
        hexBorderComp(),
        pos(position),
        polygon(points2, {fill: false})
    ])
    //return add([
    //hexBorderComp(),
    //pos(position),
    //polygon(points2, {fill: false}),
    //outline(out),
    //color(RED)
    //])
    return hex
} 