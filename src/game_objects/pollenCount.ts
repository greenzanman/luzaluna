import type { Comp, Vec2, GameObj } from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_CAPACITY, HEALTH_CAPACITY} from "../main"

interface PollenCountComp extends Comp {
    curr_pollens: number;
    increasePollens: () => void;
    decreasePollens: () => void;
    getPollens:() => number;
    getPollenPercentage: () => number;
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
            getPollenPercentage()
            {
                const percentage = Math.round(this.curr_pollens / pollens * 100) / 100;
                debug.log(percentage);
                return this.curr_pollens / pollens;
            },
            draw() 
            {
                this.text = "Pollens:" + this.curr_pollens;
            }
        }
}

export function createPollenCount(xPos: number, yPos: number, txt: string, border: GameObj): GameObj {
    return border.add([
        pos(xPos, yPos),
        text(txt),
        color(BLACK),
        scale(.5),
        anchor("botleft"),
        pollenCountComp(POLLEN_CAPACITY),
        "pollenCount"
    ]);
}