import type { Comp, Vec2, GameObj } from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_CAPACITY, HEALTH_CAPACITY} from "../main"


// Player Object

export interface PlayerComp extends Comp {
    playerState: number; // 0 - Vulnerable, 1 - Invincible
    velocity: Vec2;
    bump: (cause: Vec2, coef: number, biasX: number, biasY: number) => void;
    push: (dir: Vec2) => void;
    setPlayerState: (state: number) => void;
    getPlayerState: () => number;
}

function playerComp(velocity: Vec2): PlayerComp {
    return {
        id: "playerComp",
        playerState: 0,
        velocity: velocity,
        require: ["health"],
        update() {
            this.velocity.y += GRAVITY * dt();
            this.move(this.velocity.x * dt(), this.velocity.y * dt());
        },
        bump(cause: Vec2, coef: number, biasX: number, biasY: number) {
            let bumpDir = this.worldPos().add(cause.scale(-1)).unit();
            this.velocity = bumpDir.scale(BUMP_SPEED * coef);
            this.velocity = this.velocity.add(vec2(biasX, biasY));
        },
        push(dir: Vec2)
        {
            this.velocity = this.velocity.add(dir);
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
    return border.add([
        playerComp(vec2(0, -5000)),
        health(HEALTH_CAPACITY),
        area(),
        rect(30, 30),
        timer(),
        anchor("center"),
        pos(x, y),
        color(0.5, 0.5, 1),
        "player"
    ]);
}