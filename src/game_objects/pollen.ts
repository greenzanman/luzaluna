import type { Comp, GameObj, Vec2} from "kaplay";
import {POLLEN_SPEED} from "../main"
import { getDt } from "../scenes/game";
import { PlayerComp } from "./player";

interface PollenComp extends Comp {
    velocity: Vec2
}

function pollenComp(newVelocity: Vec2, player: GameObj<PlayerComp>): PollenComp {
    return {
        id: "pollenComp",
        require: ["pos"],
        velocity: newVelocity,
        update() {
            this.moveBy(this.velocity.scale(getDt(player)))
        }
    };
}

export function createPollen(position: Vec2, vel: Vec2, player: GameObj<PlayerComp>) {
    let pollen = add([
        rect(6, 6),
        area(),
        anchor("center"),
        pos(position.x, position.y),
        pollenComp(vel, player),
        color(220, 202, 105),
        "pollen"
    ]);

    pollen.onCollide("flower", () => {
        pollen.destroy();
    })
    pollen.onCollide("wasp", () => {
        pollen.destroy();
    })
    pollen.onCollide("bigWasp", () => {
        pollen.destroy();
    })
}
