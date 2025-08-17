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
        require: ["pos", "sprite"],
        target: target,
        velocity: startVelocity,
        aggression: 1 + Math.min(newAggression / 10, 0.5),
        add() {
            this.area.scale = 0.6
        },
        update() {
            this.animSpeed = this.target.getDilation()
            this.flipX = (this.target.worldPos().x > this.worldPos().x)
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

export function emitWaspParticles(numParticles: number, centerPos: Vec2)
{
    // // TODO: Find out if particle emitter is being properly destroyed
    let loadedSpriteData = getSprite("sparkSheet").data;
    // console.log(loadedSpriteData)
    let particleEmitter = add([
        pos(centerPos),
        timer(),
        particles({
            max: numParticles,
                speed: [40, 100],
                lifeTime: [0.75,1.0],
                angle: [0, 360],
                opacities: [1.0, 0.0],
                texture: loadedSpriteData.tex, // texture of the sprite
                quads: loadedSpriteData.frames, // to tell whe emitter what frames of the sprite to use
            }, {
                direction: 0,
                spread: 360,
                lifetime: 1.0,
            }),
        "particles"
    ])
    particleEmitter.emit(numParticles);
}

export function createWasp(position: Vec2, player: GameObj<PosComp | PlayerComp>, stats: Object, aggression: number, startVelocity: Vec2) {
    let wasp =  add([
        pos(position),
        scale(0.4),
        area(),
        sprite("smallWasp", {anim: "waspFly"}),
        anchor("center"),
        waspComp(player, aggression, startVelocity),
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
        emitWaspParticles(5, wasp.worldPos())
    })

    return wasp
}