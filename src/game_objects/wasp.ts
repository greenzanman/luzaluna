import type { Comp, Vec2, GameObj, PosComp, HealthComp } from "kaplay";
import {WASP_SPEED} from "../main";
import { PlayerComp } from "./player";

// Wasp Object

export interface WaspComp extends Comp {
    target: GameObj<PosComp>;
    aggression: number;
}

function waspComp(target: GameObj<PosComp>, newAggression: number): WaspComp {
    return {
        id: "waspComp",
        require: ["pos"],
        target: target,
        aggression: 1 + Math.min(newAggression / 10, 0.5),
        update() {
            let dir = target.worldPos().sub(this.worldPos()).unit()
            this.move(dir.x * WASP_SPEED * dt() * this.aggression, dir.y * WASP_SPEED * dt() *  this.aggression)
        }
    }
}

export function createWasp(position: Vec2, player: GameObj<PosComp | PlayerComp>, stats: Object, aggression: number) {
    let wasp =  add([
        pos(position),
        area(),
        rect(15, 15),
        anchor("center"),
        waspComp(player, aggression),
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