import type { Comp, Vec2, GameObj } from "kaplay";
import {POLLEN_CAPACITY, POLLEN_RECHARGE_RATE} from "../main"

interface PollenAmmoComp extends Comp {
    AmmoCount: number;
    width: number;
    height: number;
    IncreaseAmmo: (amount: number) => void;
    DecreaseAmmo: (amount: number) => void;
    GetAmmo:() => number;
}

function pollenAmmoComp(width: number, height: number): PollenAmmoComp {
    return {
            id: "pollenCountComp",
            width: width,
            height: height,
            require: ["pos"],
            AmmoCount: POLLEN_CAPACITY,
            IncreaseAmmo(amount: number)
            {
                this.AmmoCount = Math.min(POLLEN_CAPACITY, this.AmmoCount + amount);
            },
            DecreaseAmmo(amount: number)
            {
                this.AmmoCount = Math.max(0, this.AmmoCount - amount)
            },
            GetAmmo()
            {
                return this.AmmoCount;
            },
            draw() 
            {
                drawRect({width: this.width * this.AmmoCount / POLLEN_CAPACITY, height: this.height,
                    pos: vec2(0, 0), color: color(220, 202, 105).color
                })
            },
            update()
            {
                this.IncreaseAmmo(dt() * POLLEN_RECHARGE_RATE)
            },
        }
}

export function createAmmoCount(position: Vec2, width: number, height: number) {
    return add([
        pos(position),
        pollenAmmoComp(width, height),
        "pollenCount"
    ]);
}