import type { Comp, Vec2, GameObj, Color} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"

interface HeartComp extends Comp {
    heartState: boolean, // true - full, false - empty
    getHeartState: () => number;
    setHeartState: (newState: boolean) => void;
}

function heartComp(): HeartComp {
    return {
            id: "heartComp",
            heartState: true,
            require: ["pos"],
            getHeartState(): number {
            return this.heartState;
            },
            setHeartState(newState: boolean) {
                this.heartState = newState
            },
            draw() {
                if(!this.heartState) {
                    drawCircle({pos: vec2(0, 0), radius: 20})
                }
            }
        }
}

export function createHeart(xPos: number, yPos: number, out: number, out_color: Color, healthBar: GameObj): void {
    let heart = healthBar.add([
        circle(20),
        anchor("botleft"),
        pos(xPos, yPos),
        heartComp(),
        outline(out, out_color),
        color(RED),
        "heart"
    ]);
}