import type { Comp, Vec2, GameObj, PosComp, HealthComp } from "kaplay";
import { PlayerComp } from "./player";
import {
    BUMP_SPEED,
} from "../main";
import { getDt } from "../scenes/game";
import { emitWaspParticles } from "./wasp";

const PATIENCE_VAL = 6;
const WASP_MOVE_SPEED = 150;
const WASP_HEALTH = 25;
const WASP_ROTATE_SPEED = 100;
const WASP_SIDE_ROT = 20;
const WASP_DASH_DISTANCE = 250;
const WINDUP_LENGTH = 0.4
const WASP_HEIGHT_VARIANCE = 100;
// Wasp Object

export interface BigWaspComp extends Comp {
    target: GameObj<PosComp>;
    health: number;
    patience: number;
    mode: number;
    state: number;
    moving: boolean;
    moveTarget: Vec2;
    center: Vec2;
    dimensions: Vec2;
    shakeTimer: number;
    think: (deltaTime: number) => void;
    updateState: () => number;
    updateMode: () => void;
    performActions: (deltaTime: number) => void;
    hurt: () => void;
}

function bigWaspComp(target: GameObj<PosComp>, newCenter: Vec2, newDimensions: Vec2): BigWaspComp {
    return {
        id: "BigWaspComp",
        require: ["pos", "rotate"],
        target: target,
        health: WASP_HEALTH,    
        patience: PATIENCE_VAL - 2,
        mode: 0, // 0 - idle, 1 - move to center, 2 - move to right, 3 - move to left, 4 - charging charge, 5 - charge
        state: 0, // 0 - move to center, 1 - move side to side, 2 - charging, 3 - charge
        moving: true,
        center: newCenter,
        moveTarget: newCenter,
        shakeTimer: 0,
        dimensions: newDimensions,
        add() {
            this.area.scale = 0.5
        },
        update() {
            this.think(getDt(this.target))
            this.performActions(getDt(this.target))
        },
        think (deltaTime: number)
        {
            this.patience -= deltaTime
            if (this.patience < 0)
            {
                // Don't do plus?
                this.patience = this.updateState()
            }
        },
        updateState ()
        {
            console.log("Updating state from", this.state)
            // Choosing next mode
            switch (this.state)
            {
                case 0:
                    this.state = Math.floor(rand(1, 3))
                    break;
                case 1:
                    this.state = 2 // Side to side always goes into charge
                    break;
                case 2: // Charging charge always goes into charge
                    this.state = 3
                    this.angle = 0
                    break;
                case 3: // 75/25 for doing a nother charge
                    let randVal = Math.floor(rand(4))
                    this.state = randVal == 0 ? 0 : 2
                    break;
            }
            // Making decisions mased on that
            switch (this.state)
            {
                case 0:
                    this.mode = 1
                    this.moving = true;
                    this.moveTarget = this.center;
                    return PATIENCE_VAL / 2;
                case 1:
                    this.moving = true;
                    let randVal = Math.floor(rand(2))
                    this.mode = 2 + randVal;
                    this.moveTarget = this.center.add(vec2((1 - 2 * randVal) * newDimensions.x / 2, rand(-WASP_HEIGHT_VARIANCE, WASP_HEIGHT_VARIANCE)));
                    return PATIENCE_VAL * 2;
                case 2:
                    this.moving = false;
                    this.mode = 4;
                    return PATIENCE_VAL / 2
                case 3:
                    this.moving = true;
                    this.mode = 5;
                    this.moveTarget =  this.target.worldPos().add(
                    this.target.worldPos().sub(this.worldPos()).unit().scale(WASP_DASH_DISTANCE))
                    return PATIENCE_VAL; // Done through updateMode
            }
            return PATIENCE_VAL
        },
        updateMode()
        {
            switch (this.state)
            {
                case 0: // Reached center, meaning stop
                    this.moving = false;
                    this.mode = 0;
                    break;
                case 1: // Switch to other side
                    if (this.mode == 2)
                    {
                        this.mode = 3;
                        this.moveTarget = this.center.sub(vec2(newDimensions.x / 2, rand(-WASP_HEIGHT_VARIANCE, WASP_HEIGHT_VARIANCE)));
                    }
                    else
                    {
                        this.mode = 2;
                        this.moveTarget = this.center.add(vec2(newDimensions.x / 2, rand(-WASP_HEIGHT_VARIANCE, WASP_HEIGHT_VARIANCE)));
                    }
                    break;
                case 2:
                    return;
                case 3:
                    this.patience = this.updateState();
                    break;
            }
        },
        performActions (deltaTime: number)
        {
            let speed = WASP_MOVE_SPEED * deltaTime
            switch (this.state)
            {
                case 1:
                    speed *= 2
                    break;
                case 2:
                    if (this.patience < WINDUP_LENGTH)
                    {
                        let movement = this.worldPos().sub(this.target.worldPos())
                        movement = movement.unit().scale(speed)
                    this.moveBy(movement)
                    }    
                    else
                    {
                        this.shakeTimer -= getDt(this.target);
                        if (this.shakeTimer <= 0)
                        {
                            this.shakeTimer += 0.02
                            this.angle = rand(-20, 20)
                        }
                    }
                    break;
                case 3:
                    speed *= 3
                    break;
            }
            
            switch (this.mode)
            {
                case 2: 
                    this.angle = Math.min(this.angle + getDt(this.target) * WASP_ROTATE_SPEED, WASP_SIDE_ROT)
                    break;
                case 3:
                    this.angle = Math.max(this.angle - getDt(this.target) * WASP_ROTATE_SPEED, -WASP_SIDE_ROT)
                    break;
            }
            
            if (this.moving)
            {
                let dist = this.moveTarget.sub(this.worldPos());
                if ( dist.len() > speed)
                {
                    let movement = dist.unit().scale(speed);
                    this.moveBy(movement.x, movement.y)            
                }
                else
                {
                    this.worldPos(this.moveTarget);
                    this.updateMode()
                }
                this.flipX = (dist.x > 0)
            }

        },
        hurt()
        {
            this.health -= 1;
            if (this.health <= 0)
            {
                this.destroy()
                emitWaspParticles(20, this.worldPos())
                this.trigger("death")
            }
        }
    }
}

export function createBigWasp(position: Vec2, player: GameObj<PosComp | PlayerComp>,
        center: Vec2, dimensions: Vec2, stats: Object
) {
    let wasp =  add([
        pos(position),
        area(),
        rotate(),
        scale(1),
        sprite("smallWasp", {anim: "waspFly"}),
        anchor("center"),
        bigWaspComp(player, center, dimensions),
        "bigWasp"
    ]);

    const waspSound = play("wasp", {loop: true, volume: .1})
    
    wasp.onCollide("pollen", () => {
        wasp.hurt()
    });

    wasp.onCollide("player", () => {
        player.takedamage(1);
        player.bumpDirect(wasp.worldPos(), 0.3)
    });

    wasp.onDestroy(() => {
        waspSound.stop()
    })
    return wasp
}