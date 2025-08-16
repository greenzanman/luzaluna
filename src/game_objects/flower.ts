import type { Comp, Vec2, GameObj} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED} from "../main"
import {PlayerComp} from "./player"


// Flower object

export interface FlowerComp extends Comp {
    flowerState: number;
    evolveTimer: number;
    evolveState: number;
    flowerScale: number;
    direction: Vec2;
    getFlowerState: () => number;
    setFlowerState: (newState: number) => void;
    evolve: () => void;
}

function flowerComp(newDirection: Vec2): FlowerComp {
    return {
        id: "flowerComp",
        flowerState: 0,
        evolveState: 0,
        evolveTimer: 0,
        flowerScale: 0,
        direction: newDirection,
        require: ["pos"],
        getFlowerState(): number {
            return this.flowerState;
        },
        setFlowerState(newState: number) {
            if (this.flowerState == 0) {
                this.trigger("bloom")
                this.flowerScale = 0
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
            if (this.flowerState > 0)
            {
                this.flowerScale = Math.min(this.flowerScale + dt(), 1)
            }
            else
            {
                this.flowerScale = Math.max(this.flowerScale - dt(), 0)
            }
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
                this.flowerScale = Math.min(this.flowerScale, this.flowerState / 2)
                const scal = Math.max(Math.min(100, this.flowerScale * 100), 0.1)
                drawSprite({pos: this.direction.unit().scale((scal - 100) / 5), sprite: "flower", anchor: "center", width: scal, height: scal})
            }
        }
    };
}

export function createFlower(position: Vec2, flowerDirection: Vec2, player: GameObj<PlayerComp>,
    border: GameObj, rotation: number
) {
    
    let flower = add([
        area(),
        scale(0.85),
        sprite("bud"),
        anchor("center"),
        pos(border.toWorld(position)),
        rotate(rotation),
        flowerComp(flowerDirection),
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