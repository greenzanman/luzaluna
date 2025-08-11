import type { Comp, Vec2, GameObj } from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_CAPACITY, HEALTH_CAPACITY} from "../main"

interface CustomTimerComp extends Comp {
    curr_time: number;
    getTime(): () => number;
}

function customTimerComp(start_time: number): CustomTimerComp {
    return {
            id: "customTimerComp",
            require: ["pos", "text"],
            curr_time: start_time,
            getTime() {
                return this.curr_time
            },
            draw() 
            {
                this.curr_time = Math.round((time() - start_time) * 1000) / 1000;
                this.text = "Time:" + this.curr_time;
            }
        }
}

export function createCustomTimer(xPos: number, yPos: number, txt: string, start_time: number): GameObj {
    return add([
        pos(xPos, yPos),
        text(txt),
        color(BLACK),
        scale(.5),
        customTimerComp(start_time),
        "customTimer"
    ]);
}