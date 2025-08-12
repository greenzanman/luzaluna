import type { Comp, Vec2, GameObj } from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_CAPACITY, HEALTH_CAPACITY} from "../main"

interface BumpCountComp extends Comp {
    curr_bumps: number;
    increaseBumps: () => void;
    getBumps:() => number;
}

function bumpCountComp(): BumpCountComp {
    return {
            id: "pollenCountComp",
            require: ["pos", "text"],
            curr_bumps: 0,
            increaseBumps()
            {
                this.curr_bumps++;
            },
            getBumps() 
            {
                return this.curr_bumps;
            },
            draw() 
            {
                this.text = "Bumps:" + this.curr_bumps;
            }
        }
}

export function createBumpCount(xPos: number, yPos: number, txt: string, border: GameObj): GameObj {
    return border.add([
        pos(xPos, yPos),
        text(txt),
        color(BLACK),
        scale(.5),
        anchor("botleft"),
        bumpCountComp(),
        "pollenCount"
    ]);
}