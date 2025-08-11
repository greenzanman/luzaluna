import type { Comp, Vec2, GameObj } from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_CAPACITY, HEALTH_CAPACITY} from "../main"

interface PollenCountComp extends Comp {
    curr_pollens: number;
    increasePollens: () => void;
    decreasePollens: () => void;
    getPollens:() => number;
}

function pollenCountComp(pollens: number): PollenCountComp {
    return {
            id: "pollenCountComp",
            require: ["pos", "text"],
            curr_pollens: pollens,
            increasePollens()
            {
                this.curr_pollens != POLLEN_CAPACITY ? this.curr_pollens++ : this.curr_pollens;
            },
            decreasePollens()
            {
                this.curr_pollens--;
            },
            getPollens() 
            {
                return this.curr_pollens;
            },
            draw() 
            {
                this.text = "Pollens:" + this.curr_pollens;
            }
        }
}

export function createPollenCount(xPos: number, yPos: number, txt: string): GameObj {
    return add([
        pos(xPos, yPos),
        text(txt),
        color(BLACK),
        scale(.5),
        pollenCountComp(POLLEN_CAPACITY),
        "pollenCount"
    ]);
}