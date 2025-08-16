import type { Comp, Vec2, GameObj, PosComp, HealthComp } from "kaplay";
import {WASP_SPEED} from "../main";
import { PlayerComp } from "./player";

// Wasp Object

export interface WaspComp extends Comp {
    target: GameObj<PosComp>;
}

function waspComp(target: GameObj<PosComp>): WaspComp {
    return {
        id: "waspComp",
        require: ["pos"],
        target: target,
        update() {
            let dir = target.worldPos().sub(this.worldPos()).unit()
            this.move(dir.x * WASP_SPEED * dt(), dir.y * WASP_SPEED * dt())
        }
    }
}

export function createWasp(position: Vec2, player: GameObj<PosComp | PlayerComp>, stats: Object) {
    let wasp =  add([
        pos(position),
        area(),
        rect(15, 15),
        anchor("center"),
        waspComp(player),
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