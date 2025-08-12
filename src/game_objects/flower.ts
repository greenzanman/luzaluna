import type { Comp, Vec2, GameObj} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED} from "../main"
import {PlayerComp} from "./player"


// Flower object

interface FlowerComp extends Comp {
    flowerState: number;
    flowerType: number; // 0 - left, 1 - bottom, 2 - right, 3 - top
    getFlowerState: () => number;
    setFlowerState: (newState: number) => void;
}

function flowerComp(flowerType: number): FlowerComp {
    return {
        id: "flowerComp",
        flowerState: 0,
        flowerType: flowerType,
        require: ["pos"],
        getFlowerState(): number {
            return this.flowerState;
        },
        setFlowerState(newState: number) {
            this.flowerState = newState
        },
        update() {
            this.flowerState = Math.max(0, this.flowerState - dt())
            this.area.scale = this.flowerState > 0 ? 2 : 1;
        },
        draw() {0
            if (this.flowerState > 0) {
                drawCircle({pos: vec2(0, 0), radius: Math.min(20, this.flowerState * 10)})
                //this.scale = this.flowerState > 0 ? 2 : 1;
            }
        }
    };
}

/*
export function createFlower(x: number, y: number, flowerType: number, player: GameObj, 
    border: GameObj
) {
    let flower = border.add([
        rect(20, 20),
        area(),
        anchor("center"),
        pos(x, y),
        flowerComp(flowerType),
        "flower"
    ]);
    flower.onCollide("pollen", () => {
        flower.setFlowerState(5);
    });
 
    
    flower.onCollide("player", () => {
        if (flower.getFlowerState() > 0)
        {
            // Dispatch bump event in order to regen pollen.
            flower.trigger("bump");
        } else {
            player.hurt(1);
        }

        switch (flowerType)
        {
            case 0:
                player.bumpY(flower.worldPos(), 1);
                break;
            case 1:
                player.bumpX(flower.worldPos(), -1);
                break;
            case 2:
                player.bumpY(flower.worldPos(), -1);
                break;
            case 3:
                player.bumpX(flower.worldPos(), 1);
                break;
        }
    })
}
*/

export function createFlower(position: Vec2, flowerType: number, player: GameObj, 
    border: GameObj
) {
    let flower = border.add([
        rect(20, 20),
        area(),
        anchor("center"),
        pos(position),
        flowerComp(flowerType),
        "flower"
    ]);
    flower.onCollide("pollen", () => {
        flower.setFlowerState(5);
    });
 
    
    flower.onCollide("player", () => {
        if (flower.getFlowerState() > 0)
        {
            // Dispatch bump event in order to regen pollen.
            flower.trigger("bump");
        } else {
            player.hurt(1);
        }

        switch (flowerType)
        {
            case 0:
                player.bumpY(flower.worldPos(), 1);
                break;
            case 1:
                player.bumpX(flower.worldPos(), -1);
                break;
            case 2:
                player.bumpY(flower.worldPos(), -1);
                break;
            case 3:
                player.bumpX(flower.worldPos(), 1);
                break;
        }
    })
}