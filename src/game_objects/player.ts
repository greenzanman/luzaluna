import type { Comp, Vec2, GameObj } from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_CAPACITY, HEALTH_CAPACITY, ROTATION_FACTOR, MAX_DT, deltaT} from "../main"


// Player Object

export interface PlayerComp extends Comp {
    playerState: number; // 0 - Vulnerable, 1 - Invincible
    velocity: Vec2;
    ang_velocity: number;
    bump: (cause: Vec2, coef: number, biasX: number, biasY: number) => void;
    spin: (coef: number) => void;
    push: (dir: Vec2) => void;
    emitParticles: (numParticles: number) => void;
    setPlayerState: (state: number) => void;
    getPlayerState: () => number;
}

function playerComp(velocity: Vec2, ang_velocity: number): PlayerComp {
    return {
        id: "playerComp",
        playerState: 0,
        velocity: velocity,
        ang_velocity: ang_velocity,
        require: ["health"],
        update() {            
            // Handles linear movement
            const dT = deltaT() 
            this.velocity.y += GRAVITY * dT;
            this.move(this.velocity.scale(dT));

            // Handles rotation
            this.rotateBy(this.ang_velocity * dT)
        },
        bump(cause: Vec2, coef: number) {
            let bumpDir = this.worldPos().add(cause.scale(-1)).unit();
            this.velocity = bumpDir.scale(BUMP_SPEED * coef);
        },
        spin(coef: number) 
        {
            this.ang_velocity = coef * ROTATION_FACTOR
        },
        push(dir: Vec2)
        {
            this.velocity = this.velocity.add(dir);
        },
        emitParticles(numParticles: number)
        {
            // TODO: Find out if particle emitter is being properly destroyed
            let loadedSpriteData = getSprite("bean").data;
            console.log(loadedSpriteData)
            let particleEmitter = add([
                pos(this.worldPos()),
                timer(),
                particles({
                    max: numParticles,
                    speed: [75, 500],
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
            ])
            particleEmitter.emit(numParticles);
        },
        setPlayerState(state: number)
        {
            this.playerState = state;
        },
        getPlayerState()
        {
            return this.playerState;
        }
    }
}

export function createPlayer(x: number, y: number, border: GameObj): GameObj {
    const player = border.add([
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

    //  TODO: Fix asynchronous issue here
    debug.log("Starting load sprite")
    loadSprite("bean", "icon.png").then(() => {
        debug.log('Finished loading sprite')
    })
    return player
}