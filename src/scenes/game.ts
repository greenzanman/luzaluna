import {
    SCREEN_WIDTH, 
    SCREEN_HEIGHT, 
    FLOWER_SPACING, 
    GRAVITY, 
    BUMP_SPEED,
    POLLEN_SPEED, 
    POLLEN_PUSH, 
    POLLEN_CAPACITY, 
    POLLEN_RECHARGE_RATE,
    PADDING_VERT,
    PADDING_HORIZ,
    BORDER_THICKNESS,
    HEART_SPACING,
    HEALTH_CAPACITY
} from "../main"
import {createArrow, createPlayer} from "../game_objects/player"
import {createFlower, FlowerComp} from "../game_objects/flower"
import {createPollen} from "../game_objects/pollen"
import {createHexBorder} from "../game_objects/hexBorder"

import {createHeart} from "../game_objects/heart"
import {createHealthBar} from "../game_objects/healthBar"

import {createAmmoCount} from "../game_objects/ammoCount"

import {createCustomTimer} from "../game_objects/timer"

import {createBumpCount} from "../game_objects/bumpCount"
import { createWasp } from "../game_objects/wasp"
import { createBigWasp } from "../game_objects/bigWasp"
import { GameObj } from "kaplay"

export type Stats = {
    time: number,
    bumps: number,
    wasp_kills: number,
    bigWasp_kills: number,
    pollen_fired: number,
    flower_blooms: number
}

export function mountGameScene() {
    scene("game", (bestTime: number, bestBumps: number) => {
        let stats: Stats = {
            time: null,
            bumps: null,
            wasp_kills: 0, 
            bigWasp_kills: 0,
            pollen_fired: 0,
            flower_blooms: 0
        }
        // Create player
        const player = createPlayer(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        const arrow = createArrow(player)
        let mousePressed = false

        const rect = canvas.getBoundingClientRect();
        const borderWidth = SCREEN_WIDTH - PADDING_HORIZ * 2
        const borderHeight = SCREEN_HEIGHT - PADDING_VERT * 2
        const borderPos = vec2(rect.width / 2 - borderWidth / 2, rect.height / 2 - borderHeight / 2)
        const center = vec2(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)
        const hex = createHexBorder(borderPos, borderWidth, borderHeight, BORDER_THICKNESS)

        const segments = hex.pts.map((pt, i, arr) => [pt, arr[(i + 1) % arr.length]]);

        //For each segment interpolate the flowers along the segment.
        loadSprite("bud", "BUD.png");
        loadSprite("flower", "FLOWER.png");
        const flowers: GameObj<FlowerComp>[] = [];
        segments.forEach(([start, end], i) => {
            const dx = end.x - start.x;
            const dy = end.y - start.y;

            // Normal vector: rotate direction vector 90 degrees
            const nx = -dy;
            const ny = dx;
            // Angle of the normal vector (in radians)
            const angle = rad2deg(Math.atan2(ny, nx));

            Array.from({ length: FLOWER_SPACING }).forEach((_, j) => {
                const position = vec2(lerp(start.x, end.x, (j + 0.5) / FLOWER_SPACING),lerp(start.y, end.y, (j + 0.5) / FLOWER_SPACING));
                flowers.push(createFlower(position, vec2((end.y - start.y), -(end.x-start.x)), player, hex, angle - 90));
            });
        });


        // Create border    
        const customTimer = createCustomTimer(SCREEN_WIDTH - PADDING_HORIZ - 550, HEART_SPACING / 2 + PADDING_VERT - 70, "Time: 0", time());

        // Create pollen count
        const ammoCount = createAmmoCount(vec2(SCREEN_WIDTH - PADDING_HORIZ - 150, HEART_SPACING / 2 + PADDING_VERT - 70), 150, 50)

        // Creat bump count
        const bumpCount = createBumpCount(SCREEN_WIDTH - PADDING_HORIZ - 425, HEART_SPACING / 2 + PADDING_VERT - 70, "Bumps: 0")

        // Create health bar
        const healthBar = createHealthBar(PADDING_HORIZ, HEART_SPACING / 2 + PADDING_VERT - 85, 40)
        // Create hearts
        for (let i = 0, j = 0; j < HEALTH_CAPACITY; i += HEART_SPACING, j++) {
            createHeart(HEART_SPACING / 2 + i, HEART_SPACING / 2, 4, color(220, 202, 105).color, healthBar)
        }

        // Bump event listener
        on("bump", "*", () => {
            ammoCount.IncreaseAmmo(POLLEN_CAPACITY / 4);
            bumpCount.increaseBumps();
        })

        on("death", "wasp", () => {
            stats.wasp_kills++
        })

        let waspPresent = false
        on("death", "bigWasp", () => {
            stats.bigWasp_kills++
            waspPresent = false
            
        })

        on("bloom", "flower", () => {
            stats.flower_blooms++
        })

        on("explode", "flower", (flower) => {
            let timeRatio = Math.max(customTimer.getTime() - RAMP_START, 0) / RAMP_RATE
            timeRatio = Math.min(timeRatio, RAMP_MAX)
            for (let i = 0; i < rand(1 + timeRatio / 2, 1 + timeRatio); i++)
            {
                createWasp(flower.worldPos(), player, stats, 0, flower.direction.unit().scale(80)
                    .add(vec2(rand(-80, 80), rand(-80, 80))))
            }
        })

        // Decreases health when player gets hurt.
        player.onHurt((damage) => {
            let heart = healthBar.get("heart").findLast((heart) => heart.getHeartState())
            if(heart) {heart.setHeartState(false);}

            // Emit particles
            player.emitParticles(10)

            debug.log(player.hp())

            if(player.hp() <= 0) {
                stats.time = customTimer.getTime()
                stats.bumps = bumpCount.getBumps()
                go("loss", stats, bestTime, bestBumps);
            }

            
        })

        let waspPatience = 5
        const RAMP_START = 15
        const RAMP_RATE = 30
        const RAMP_MAX = 2
        function CreateEnemies() {
            let timeRatio = Math.max(customTimer.getTime() - RAMP_START, 0) / RAMP_RATE
            waspPatience -= dt() * (1 + Math.min(timeRatio, RAMP_MAX))
            if (waspPatience < 0)
            {
                let spawnLoc = vec2(SCREEN_WIDTH / 2, - 50)
                let type = Math.floor(rand(9) / 2)
                if (type == 4 && timeRatio > 0 && (!waspPresent || timeRatio > 4)) // TODO: improve spawning
                {
                    waspPatience += 15
                    createBigWasp(spawnLoc, player,center, vec2(SCREEN_WIDTH, SCREEN_HEIGHT), stats);
                    waspPresent = true
                }
                else {
                    switch (type)
                    {
                        case 0:
                            spawnLoc = vec2(0, rand(SCREEN_HEIGHT))
                            break;
                        case 1:
                            spawnLoc = vec2(SCREEN_WIDTH, rand(SCREEN_HEIGHT))
                            break;
                        case 2:
                            spawnLoc = vec2(rand(SCREEN_WIDTH), SCREEN_HEIGHT)
                            break;
                        case 3:
                            spawnLoc = vec2(rand(SCREEN_WIDTH), SCREEN_HEIGHT)
                            break;
                    }
                    waspPatience += rand(3, 6)
                    createWasp(spawnLoc, player, stats, timeRatio, vec2(0, 0))
                }
            }
        }
    
        let flowerPatience = 2
        function createFlowers() {
            let timeRatio = Math.max(customTimer.getTime() - RAMP_START + 5, 0) / RAMP_RATE
            if (timeRatio > 0)
                flowerPatience -= dt() * (1 + Math.min(timeRatio, RAMP_MAX))
            if (flowerPatience < 0)
            {
                let gottenFlower = flowers[Math.floor(rand(flowers.length))]
                if (gottenFlower.getFlowerState() == 0)
                {
                    gottenFlower.evolve();
                    flowerPatience += rand(8, 14);
                }
                else
                {
                    flowerPatience += 0.2
                }
            }
        }

        let pollenDelay = 0
        const POLLEN_DELAY = 0.05
        let inaccuracy = 0
        const INACCURACY_FLOOR = 0.5
        const INACCURACY_COEF = 100

        // Tick function
        onUpdate(() => {
            // QOL click and hold
            if (isMousePressed())
            {
                mousePressed = true
            }
            // Shooting pollen
            pollenDelay = Math.max(pollenDelay - dt(), 0);
            if (isMouseDown() && mousePressed)
            {
                if (ammoCount.GetAmmo() >= 1)
                {
                    if (pollenDelay == 0) {
                    //let dir = mousePos().sub(player.worldPos()).unit()
                        pollenDelay = POLLEN_DELAY
                        let dir = mousePos().sub(player.worldPos()).scale(-1).unit()
                        ammoCount.DecreaseAmmo(1)
                        let inaccuracyVal = Math.max(inaccuracy - INACCURACY_FLOOR, 0) * INACCURACY_COEF
                        let inaccuracyOffset = vec2(rand(-inaccuracyVal, inaccuracyVal), rand(-inaccuracyVal, inaccuracyVal))
                        createPollen(player.worldPos(), dir.scale(POLLEN_SPEED).add(inaccuracyOffset))
                        player.push(dir.scale(-POLLEN_PUSH))
                        stats.pollen_fired++
                    }
                }
                else // Force release and reclick once out of pollen
                {
                    mousePressed = false
                    inaccuracy = Math.max(0, inaccuracy * dt() - 4)
                }
                inaccuracy += dt()
            }
            else
            {
                inaccuracy = Math.max(0, inaccuracy * dt() - 4)
            }

            CreateEnemies()
            createFlowers()
        });
    });
}

