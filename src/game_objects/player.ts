import type { Comp, Vec2 } from "kaplay";
import {GRAVITY, BUMP_SPEED, HEALTH_CAPACITY} from "../main"


// Player Object

export interface PlayerComp extends Comp {
    playerState: number;
    velocity: Vec2;
    invulTimer: number;
    bump: (cause: Vec2, direction: Vec2) => void;
    setVelocity: (newVelocity: Vec2) => void;
    push: (dir: Vec2) => void;
    takedamage: (damage: number) => void;
}

function playerComp(startVelocity: Vec2): PlayerComp {
    return {
        id: "playerComp",
        playerState: 0,
        velocity: startVelocity,
        require: ["health"],
        invulTimer: 0,
        update() {
            this.velocity.y += GRAVITY * dt();
            this.move(this.velocity.x * dt(), this.velocity.y * dt());
        
            this.invulTimer = Math.max(0, this.invulTimer - dt());
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
        push(dir: Vec2)
        {
            this.velocity = this.velocity.add(dir);
        },
        takedamage(damage: number)
        {
            if (this.invulTimer == 0)
            {
                this.hurt(damage);
                shake(6 * damage);
                this.invulTimer = 0.05;
            }
        }
    }
}

export function createPlayer(x: number, y: number) {
    return add([
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