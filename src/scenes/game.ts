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
import { rightCrosses } from "../extras/polygon"
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
        const flowers: GameObj<FlowerComp>[] = [];
        segments.forEach(([start, end], i) => {
            const dx = end.x - start.x;
            const dy = end.y - start.y;

            // Normal vector: rotate direction vector 90 degrees
            const nx = -dy;
            const ny = dx;
            // Angle of the normal vector (in radians)
            const angle = rad2deg(Math.atan2(ny, nx));

            const flowerType = i
            Array.from({ length: FLOWER_SPACING }).forEach((_, j) => {
                const position = vec2(lerp(start.x, end.x, j / FLOWER_SPACING),lerp(start.y, end.y, j / FLOWER_SPACING));
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
            ammoCount.IncreaseAmmo(POLLEN_CAPACITY / 2);
            bumpCount.increaseBumps();
        })

        on("death", "wasp", () => {
            stats.wasp_kills++
        })

        on("death", "bigWasp", () => {
            stats.bigWasp_kills++
        })

        on("bloom", "flower", () => {
            stats.flower_blooms++
        })


        // Decreases health when player gets hurt.
        player.onHurt((damage) => {
            let heart = healthBar.get("heart").findLast((heart) => heart.getHeartState())
            if(heart) {heart.setHeartState(false);}

            // Emit particles
            player.emitParticles(10)

            debug.log("HP: " + player.hp())

            if(player.hp() <= 0) {
                stats.time = customTimer.getTime()
                stats.bumps = bumpCount.getBumps()
                go("loss", stats, bestTime, bestBumps);
            }

            
        })

        let waspPatience = 5
        function CreateEnemies() {
            waspPatience -= dt()
            if (waspPatience < 0)
            {
                let spawnLoc = vec2(SCREEN_WIDTH / 2, - 50)
                let type = Math.floor(rand(9) / 2)
                if (type == 4) // TODO: improve spawning
                {
                    waspPatience += 30
                    createBigWasp(spawnLoc, player,center, vec2(SCREEN_WIDTH, SCREEN_HEIGHT), stats);
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
                    waspPatience += rand(1, 3)
                    createWasp(spawnLoc, player, stats)
                }
            }
        }
    
        let flowerPatience = 10
        function createFlowers() {
            flowerPatience -= dt()
            if (flowerPatience < 0)
            {
                let gottenFlower = flowers[Math.floor(rand(flowers.length))]
                gottenFlower.evolve();
                flowerPatience += rand(6, 14)
            }
        }

        let pollenDelay = 0
        let shootingDuration = 0
        const POLLEN_DELAY = 0.04
        const INACCURACY_FLOOR = 0.3
        const INACCURACY_COEF = 1
        const INACCURACY_MAX = 0.7

        // Shared aim direction
        let aimDirection = vec2(0, 0);

        // Tick function
        onUpdate(() => {
            
            // Calculate target direction
            const rawTargetDirection = mousePos().sub(player.worldPos()).scale(1).unit();
            // Lerp factor: higher = faster snap, lower = smoother
            const lerpAimFactor = 0.15;
            let playerShot = false;

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
                        const ammo = ammoCount.GetAmmo();
                        const ammoRatio = ammo / POLLEN_CAPACITY;

                        pollenDelay = POLLEN_DELAY;

                        ammoCount.DecreaseAmmo(1);

                        let inaccuracyVal = shootingDuration + INACCURACY_FLOOR
                        inaccuracyVal = Math.max(inaccuracyVal, INACCURACY_FLOOR) * INACCURACY_COEF
                        let inaccuracyOffset = vec2(rand(-inaccuracyVal, inaccuracyVal), rand(-inaccuracyVal, inaccuracyVal))

                        aimDirection = rawTargetDirection.add(inaccuracyOffset);
                        createPollen(player.worldPos(), aimDirection.scale(POLLEN_SPEED))


                        // Dynamic pollen push based on ammo
                        const minPush = POLLEN_PUSH * 0.5;      // normal push at full ammo
                        const maxPush = POLLEN_PUSH * 1;  // stronger push at zero ammo
                        const pushStrength = lerp(minPush, maxPush, 1 - ammoRatio);
                        player.push(aimDirection.scale(-pushStrength))
                        // if (ammoCount.GetAmmo() < POLLEN_CAPACITY / 4) {
                        //     player.push(aimDirection.scale(-POLLEN_PUSH));
                        // }

                        // Not dynamic pollen push
                        // player.push(aimDirection.scale(-POLLEN_PUSH));

                        stats.pollen_fired++

                        playerShot = true;
                    }
                }
                else // Force release and reclick once out of pollen
                {
                    mousePressed = false

                    // if u want to have a cooldown on shooting after running out of pollen:
                    // pollenDelay = 5
                }
                shootingDuration = Math.max(shootingDuration - dt(), 0);
            }
            else
            {
                // Player can nudge movement just a bit when not shooting
                const downwardness = Math.max(aimDirection.y, 0); 
                const pushMultiplier = lerp(1, 2.5, downwardness); 
                player.push(aimDirection.scale(-POLLEN_PUSH / 90 * pushMultiplier));

                shootingDuration = INACCURACY_MAX   
            }

            // If player not shooting, smoothly snap aim direction to target
            if (playerShot == false)
                    aimDirection = aimDirection.lerp(rawTargetDirection, lerpAimFactor).unit();

            CreateEnemies()

        });

        // Pass aimDirection to arrowComp
        arrow.aimDirection = () => aimDirection;
    });
}

