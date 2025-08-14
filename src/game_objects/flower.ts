import type { Comp, Vec2, GameObj} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED} from "../main"
import {PlayerComp} from "./player"


// Flower object

interface FlowerComp extends Comp {
    flowerState: number;
    getFlowerState: () => number;
    setFlowerState: (newState: number) => void;
}

function flowerComp(): FlowerComp {
    return {
        id: "flowerComp",
        flowerState: 0,
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
                const scal = Math.min(100, this.flowerState * 50)
                drawSprite({sprite: "flower", anchor: "center", width: scal, height: scal})
                //this.scale = this.flowerState > 0 ? 2 : 1;
            }
        }
    };
}

export function createFlower(position: Vec2, flowerDirection: Vec2, player: GameObj<PlayerComp>,
    border: GameObj, rotation: number
) {
    loadSprite("bud", "BUD.png");
    loadSprite("flower", "FLOWER.png");
    let flower = border.add([
        area(),
        scale(.5),
        sprite("bud"),
        anchor("center"),
        pos(position),
        rotate(rotation),
        flowerComp(),
        "flower"
    ]);
    flower.onCollide("pollen", () => {
        flower.setFlowerState(5);
    });
 
    
    flower.onCollide("player", () => {
        if (flower.getFlowerState() == 0)
        {
            player.takedamage(1)
        }
        // Dispatch bump event in order to regen pollen.
        flower.trigger("bump");
    
        player.bump(flower.worldPos(), flowerDirection);
        player.spin(rand(-1, 1))

    })
}