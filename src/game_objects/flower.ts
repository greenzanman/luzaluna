import type { Comp, Vec2, GameObj, AudioPlay} from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED} from "../main"
import {PlayerComp} from "./player"
import { createWasp } from "./wasp";
import { getDt } from "../scenes/game";

const MAX_FLOWER_STATE = 5
// Flower object

export interface FlowerComp extends Comp {
    flowerState: number;
    evolveTimer: number;
    evolveState: number;
    flowerScale: number;
    baseRotation: number;
    shakeTimer: number;
    direction: Vec2;
    player: GameObj<PlayerComp>;
    buildUp: AudioPlay | null
    getFlowerState: () => number;
    setFlowerState: (newState: number) => void;
    addFlowerState: (addState: number) => void;
    evolve: () => void;
}

function flowerComp(newDirection: Vec2, startRotation: number, newPlayer: GameObj<PlayerComp>): FlowerComp {
    return {
        id: "flowerComp",
        flowerState: 0,
        evolveState: 0,
        evolveTimer: 0,
        flowerScale: 0,
        shakeTimer: 0,
        baseRotation: startRotation,
        direction: newDirection,
        require: ["pos"],
        player: newPlayer,
        buildUp: null,
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
        addFlowerState(addState: number)
        {
            if (this.evolveState != 0)
            {
                return
            }
            if (this.flowerState == 0) {
                this.trigger("bloom")
                this.flowerScale = 0
            }
            this.flowerState = Math.min(this.flowerState + addState, MAX_FLOWER_STATE)
        },
        evolve() {
            this.evolveState = 1;
            this.evolveTimer = 4;
            this.buildUp =  play("buildUp", {volume: .4})
        },
        update() {
            let curDt = getDt(this.player)
            this.flowerState = Math.max(0, this.flowerState - curDt)
            if (this.flowerState > 0)
            {
                this.flowerScale = Math.min(this.flowerScale + curDt * 2, 1)
            }
            else
            {
                this.flowerScale = Math.max(this.flowerScale - curDt, 0)
            }
            this.area.scale = this.flowerState > 0 ? 1.25 : 0.5;

            if (this.evolveState != 0)
            {
                this.evolveTimer = Math.max(0, this.evolveTimer - curDt)
                if (this.evolveTimer <= 0)
                {
                    this.evolveState = 0
                    this.angle = this.baseRotation
                    this.flowerState = MAX_FLOWER_STATE
                    this.flowerScale = 1
                    this.buildUp.stop()
                    this.trigger("explode", this.worldPos(), this.direction)
                }
                else
                {
                    this.shakeTimer -= curDt;
                    if (this.shakeTimer <= 0)
                    {
                        this.shakeTimer += 0.02
                        this.angle = this.baseRotation + rand(-20, 20)
                    }

                }
            }
        },
        draw() {0
            if (this.flowerState > 0) {
                this.flowerScale = Math.min(this.flowerScale, this.flowerState / MAX_FLOWER_STATE)
                let scal = Math.max(Math.min(1, this.flowerScale), 0.0001)
                scal = Math.sqrt(scal) * 120;
                drawSprite({pos: vec2(0, (100 - scal) / 5 + 10), sprite: "flowerSheet", frame: 6, anchor: "center", width: scal, height: scal})
            }
        }
    };
}

export function createFlower(position: Vec2, flowerDirection: Vec2, player: GameObj<PlayerComp>,
    border: GameObj, rotation: number
) {
    
    let flower = add([
        area(),
        scale(0.73),
        sprite("flowerSheet", {frame: 0}),
        anchor("center"),
        pos(border.toWorld(position)),
        rotate(rotation),
        flowerComp(flowerDirection, rotation, player),
        "flower"
    ]);
    flower.onCollide("pollen", () => {
        flower.addFlowerState(2);
    });
 
    
    flower.onCollide("player", () => {
        if (flower.getFlowerState() == 0)
        {
            player.takedamage(1)
        } else {
            play("boing")
        }
        // Dispatch bump event in order to regen pollen.
        flower.trigger("bump");
        
    
        player.bump(flowerDirection, 1);
        player.spin(rand(-1, 1))

    })
    return flower
}