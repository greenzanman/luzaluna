import type { Comp, GameObj, Vec2 } from "kaplay";
import {GRAVITY, BUMP_SPEED, HEALTH_CAPACITY, ROTATION_FACTOR} from "../main"


// Player Object
export interface ArrowComp extends Comp {}

function arrowComp(player: GameObj): ArrowComp {
    return {
        id: "ArrowComp",
        update() {
            this.pos = player.worldPos()
            this.angle = mousePos().sub(player.worldPos()).unit().scale(-1).angle() - 90
        },
    }
}

export function createArrow(player: GameObj): GameObj{
    const arrow = add([
        arrowComp(player),
        area(),
        rect(5, 60),
        pos(player.worldPos()),
        color(RED),
        "arrow"
    ]);

    return arrow
}

export interface PlayerComp extends Comp {
    playerState: number;
    velocity: Vec2;
    angVelocity: number;
    invulTimer: number;
    bump: (cause: Vec2, direction: Vec2) => void;
    setVelocity: (newVelocity: Vec2) => void;
    push: (dir: Vec2) => void;
    takedamage: (damage: number) => void;
    spin: (coef: number) => void;
    emitParticles: (numParticles: number) => void;
    setPlayerState: (state: number) => void;
    getPlayerState: () => number;
}

function playerComp(startVelocity: Vec2, startAngVelocity: number): PlayerComp {
    return {
        id: "playerComp",
        playerState: 0,
        velocity: startVelocity,
        angVelocity: startAngVelocity,
        require: ["health"],
        invulTimer: 0,
        update() {
            this.velocity.y += GRAVITY * dt();
            this.move(this.velocity.scale(dt()));
        
            this.invulTimer = Math.max(0, this.invulTimer - dt());
            this.rotateBy(this.angVelocity * dt())
        },
        setVelocity(newVelocity: Vec2) {
            this.velocity = newVelocity  
        },
        bump(cause: Vec2, direction: Vec2) {
            let offset = this.worldPos().sub(cause).unit();
            //this.velocity = this.velocity.add(vec2(offset.x * BUMP_SPEED, 0))
            let dirProj = direction.scale(this.velocity.dot(direction) / direction.len() / direction.len())
            this.velocity = this.velocity.sub(dirProj);
            //this.velocity = direction.unit().scale(BUMP_SPEED);
            this.velocity = this.velocity.add(direction.unit().scale(BUMP_SPEED));
        },
        spin(coef: number) 
        {
            this.angVelocity = coef * ROTATION_FACTOR
        },
        push(dir: Vec2)
        {
            this.velocity = this.velocity.add(dir);
        },
        emitParticles(numParticles: number)
        {
            // // TODO: Find out if particle emitter is being properly destroyed
            // let loadedSpriteData = getSprite("bean").data;
            // console.log(loadedSpriteData)
            // let particleEmitter = add([
            //     pos(this.worldPos()),
            //     timer(),
            //     particles({
            //         max: numParticles,
            //         speed: [75, 500],
            //         lifeTime: [0.75,1.0],
            //         angle: [0, 360],
            //         opacities: [1.0, 0.0],
            //         texture: loadedSpriteData.tex, // texture of the sprite
            //         quads: loadedSpriteData.frames, // to tell whe emitter what frames of the sprite to use
            //     }, {
            //         direction: 0,
            //         spread: 360,
            //         lifetime: 1.0,
            //     }),
            // ])
            // particleEmitter.emit(numParticles);
        },
        setPlayerState(state: number)
        {
            this.playerState = state;
        },
        getPlayerState()
        {
            return this.playerState;
        },
        takedamage(damage: number)
        {
            if (this.invulTimer == 0)
            {
                this.hurt(damage);
                shake(6 * damage);
                this.invulTimer = 0.25;
            }
        }
    }
}

export function createPlayer(x: number, y: number) {
    const player = add([
        playerComp(vec2(0, -5000), 300),
        health(HEALTH_CAPACITY),
        area(),
        rect(30, 30),
        timer(),
        rotate(),
        anchor("center"),
        pos(x, y),
        color(0.5, 0.5, 1),
        "player"
    ]);
    return player
}