import type { Comp, Vec2, GameObj} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED} from "../main"
import {PlayerComp} from "./player"


// Flower object

export interface FlowerComp extends Comp {
    flowerState: number;
    evolveTimer: number;
    evolveState: number;
    getFlowerState: () => number;
    setFlowerState: (newState: number) => void;
    evolve: () => void;
}

function flowerComp(): FlowerComp {
    return {
        id: "flowerComp",
        flowerState: 0,
        evolveState: 0,
        evolveTimer: 0,
        require: ["pos"],
        getFlowerState(): number {
            return this.flowerState;
        },
        setFlowerState(newState: number) {
            if (this.flowerState == 0) {
                this.trigger("bloom")
            }
            this.flowerState = newState
        },
        evolve() {
            this.evolveState = 1;
            this.evolveTimer = 5;
            // DECIDE ON EVOLVE STATES HERE
        },
        update() {
            this.flowerState = Math.max(0, this.flowerState - dt())
            this.area.scale = this.flowerState > 0 ? 1.25 : 0.5;

            if (this.evolveState != 0)
            {
                this.evolveTimer = Math.max(0, this.evolveTimer - dt())
                if (this.evolveTimer <= 0)
                {
                    this.evolveState = 0
                }
                switch (this.evolveState)
                {
                    // DO EVOLVE STUFF HERE
                }
            }
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
    
    let flower = add([
        area(),
        scale(0.75),
        sprite("bud"),
        anchor("center"),
        pos(border.toWorld(position)),
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
    
        player.bump(flowerDirection, 1);
        player.spin(rand(-1, 1))

    })
    return flower
}