import type { Comp, GameObj } from "kaplay";

interface CustomTimerComp extends Comp {
    curr_time: number;
    getTime(): () => number;
}

function customTimerComp(start_time: number): CustomTimerComp {
    return {
            id: "customTimerComp",
            require: ["pos", "text"],
            curr_time: 0,
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
        color(220, 202, 105),
        scale(.5),
        customTimerComp(start_time),
        "customTimer"
    ]);
}