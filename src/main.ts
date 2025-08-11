import kaplay from "kaplay";
import type { Comp, Vec2 } from "kaplay";
import "kaplay/global"; 

const SCREEN_WIDTH = 640
const SCREEN_HEIGHT = 480
const FLOWER_SPACING = 40
const GRAVITY = 15000
const BUMP_SPEED = 20000

kaplay({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
});

loadRoot("./"); // A good idea for Itch.io publishing later


// Player objects
interface PlayerComp extends Comp {
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
        }
    };
}


// Flower objects
interface FlowerComp extends Comp {
    flowerState: number;
    flowerType: number; // 0 - left, 1 - bottom, 2 - right, 3 - top
    getFlowerState: () => number;
    setFlowerState: (newState: number) => void;
}

function flowerComp(flowerType: number): FlowerComp {
    return {
        id: "flowerComp",
        flowerState: 0,
        flowerType: flowerType,
        require: ["pos"],
        getFlowerState(): number {
            return this.flowerState;
        },
        setFlowerState(newState: number) {
            this.flowerState = newState
        },
        update() {
            this.flowerState = Math.max(0, this.flowerState - dt())
        },
        draw() {
            if (this.flowerState > 0) {
                drawCircle({pos: vec2(0, 0), radius: Math.min(20, this.flowerState * 10)})
            }
        }
    };
}

 // Pollen
const POLLEN_SPEED = 30000
const POLLEN_PUSH = 500

interface PollenComp extends Comp {
    xVel: number,
    yVel: number
}

function pollenComp(xVel: number, yVel: number): PollenComp {
    return {
        id: "pollenComp",
        require: ["pos"],
        xVel: xVel,
        yVel: yVel,
        update() {
            this.move(xVel * dt(), yVel * dt())
        }
    };
}

function createPollen(position: Vec2, dir: Vec2) {
    return add([
        rect(6, 6),
        area(),
        anchor("center"),
        pos(position.x, position.y),
        pollenComp(dir.x * POLLEN_SPEED, dir.y * POLLEN_SPEED),
        "pollen"
    ]);
}


scene("game", () => {
    function createPlayer(x: number, y: number) {
        return add([
            playerComp(vec2(0, -5000)),
            area(),
            rect(30, 30),
            anchor("center"),
            pos(x, y),
            color(0.5, 0.5, 1),
            "player"
        ]);
    }

    const player = createPlayer(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)

    function createFlower(x: number, y: number, flowerType: number) {
        let flower = add([
            rect(20, 20),
            area(),
            anchor("center"),
            pos(x, y),
            flowerComp(flowerType),
            "flower"
        ]);
        flower.onCollide("pollen", () => {
            flower.setFlowerState(5);
        });
        flower.onCollide("player", () => {
            if (flower.getFlowerState() > 0)
            {
                switch (flowerType)
                {
                    case 0:
                        player.bumpY(flower.worldPos(), 1);
                        break;
                    case 1:
                        player.bumpX(flower.worldPos(), -1);
                        break;
                    case 2:
                        player.bumpY(flower.worldPos(), -1);
                        break;
                    case 3:
                        player.bumpX(flower.worldPos(), 1);
                        break;
                }
            }
        })
}

    for (let i = 0; i < SCREEN_WIDTH; i += FLOWER_SPACING) {
        createFlower(FLOWER_SPACING / 2 + i, FLOWER_SPACING / 2, 3)
        createFlower(FLOWER_SPACING / 2 + i, SCREEN_HEIGHT - FLOWER_SPACING / 2, 1)
    }

    for (let i = 0; i < SCREEN_HEIGHT; i += FLOWER_SPACING) {
        createFlower(FLOWER_SPACING / 2, FLOWER_SPACING / 2 + i, 0)
        createFlower(SCREEN_WIDTH - FLOWER_SPACING / 2, FLOWER_SPACING / 2 + i, 2)
    }

    // Tick function
    onUpdate(() => {
        // Shooting pollen
        if (isMouseDown())
        {
            let dir = mousePos().add(player.worldPos().scale(-1)).unit()
            createPollen(player.worldPos(), dir)
            player.push(dir.scale(-POLLEN_PUSH))
        }

        // Loss condition
        if (player.worldPos().x < 0 || player.worldPos().x > SCREEN_WIDTH ||
            player.worldPos().y < 0 || player.worldPos().y > SCREEN_HEIGHT)
            {
                go("loss");
            }
    });
});

scene("loss", () => {
    add([
        text("YOU LOST"),
        pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 80),
        scale(3),
        anchor("center"),
    ]);
    onClick(() => go("game"));
})

go("game");