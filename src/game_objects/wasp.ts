import type { Comp, Vec2, GameObj, PosComp, HealthComp } from "kaplay";
import {WASP_SPEED} from "../main";
import { PlayerComp } from "./player";
import { getDt } from "../scenes/game";

// Wasp Object
const DEC_SPEED = 50

export interface WaspComp extends Comp {
    target: GameObj<PosComp>;
    aggression: number;
    velocity: Vec2;
}

function waspComp(target: GameObj<PosComp>, newAggression: number, startVelocity: Vec2): WaspComp {
    return {
        id: "waspComp",
        require: ["pos"],
        target: target,
        velocity: startVelocity,
        aggression: 1 + Math.min(newAggression / 10, 0.5),
        update() {
            console.log(this.worldPos())
            let dir = target.worldPos().sub(this.worldPos()).unit()
            this.moveBy(dir.scale(WASP_SPEED * getDt(this.target) * this.aggression))
            this.moveBy(this.velocity.scale(getDt(this.target)))
            if (this.velocity.len() < getDt(this.target) * DEC_SPEED)
            {
                this.velocity = vec2(0, 0)
            }
            else
            {
                this.velocity = this.velocity.sub(this.velocity.unit().scale(DEC_SPEED * getDt(this.target)))
            }
        }
    }
}

export function createWasp(position: Vec2, player: GameObj<PosComp | PlayerComp>, stats: Object, aggression: number, startVelocity: Vec2) {
    let wasp =  add([
        pos(position),
        area(),
        rect(15, 15),
        anchor("center"),
        waspComp(player, aggression, startVelocity),
        color(0.5, 0.5, 1),
        "wasp"
    ]);
    
    wasp.onCollide("pollen", () => {
        
        wasp.destroy();
    });

    wasp.onCollide("player", () => {
        wasp.destroy();
        player.takedamage(1);
    });

    wasp.onDestroy(() => {
        wasp.trigger("death")
    })

    return wasp
}