import type { Comp, Vec2, GameObj } from "kaplay";
import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_CAPACITY, HEALTH_CAPACITY} from "../main"


// Player Object

export interface PlayerComp extends Comp {
    playerState: number;
    velocity: Vec2;
    bumpX: (cause: Vec2, coef: number) => void;
    bumpY: (cause: Vec2, coef: number) => void;
    push: (dir: Vec2) => void;
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
        bumpX(cause: Vec2, coef: number) {
            let offset = this.worldPos().add(cause.scale(-1)).unit();
            this.velocity = this.velocity.add(vec2(offset.x * BUMP_SPEED, 0))
            this.velocity.y =  BUMP_SPEED * coef;
        },
        bumpY(cause: Vec2, coef: number) {
            let offset = this.worldPos().add(cause.scale(-1)).unit();
            this.velocity = this.velocity.add(0, offset.y * BUMP_SPEED)
            this.velocity.x = BUMP_SPEED * coef
        },
        push(dir: Vec2)
        {
            this.velocity = this.velocity.add(dir);
        },
    }
}

export function createPlayer(x: number, y: number, border: GameObj): GameObj {
    return border.add([
        playerComp(vec2(0, -5000)),
        health(HEALTH_CAPACITY),
        area(),
        rect(30, 30),
        anchor("center"),
        pos(x, y),
        color(0.5, 0.5, 1),
        "player"
    ]);
}