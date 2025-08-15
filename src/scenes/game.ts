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
import {createFlower} from "../game_objects/flower"
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
                createFlower(position, vec2((end.y - start.y), -(end.x-start.x)), player, hex, angle - 90);
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

            debug.log(player.hp())

            if(player.hp() <= 0) {
                stats.time = customTimer.getTime()
                stats.bumps = bumpCount.getBumps()
                go("loss", stats, bestTime, bestBumps);
            }

            
        })

        let waspPatience = 0
        function CreateEnemies() {
            waspPatience -= dt()
            if (waspPatience < 0)
            {
                waspPatience += 5
                let spawnLoc = vec2(0, 0)
                let type = Math.floor(rand(5))
                if (type == 4) // TODO: improve spawning
                {
                    waspPatience += 1000
                    createBigWasp(spawnLoc, player,center, vec2(SCREEN_WIDTH, SCREEN_HEIGHT), stats);
                }
                else {
                    switch (type)
                    {
                        case 0:
                            spawnLoc = vec2(0, 0)
                            break;
                        case 1:
                            spawnLoc = vec2(SCREEN_WIDTH, 0)
                            break;
                        case 2:
                            spawnLoc = vec2(SCREEN_HEIGHT, SCREEN_HEIGHT)
                            break;
                        case 3:
                            spawnLoc = vec2(0, SCREEN_HEIGHT)
                            break;
                    }
                    createWasp(spawnLoc, player, stats)
                }
            }
        }
    
        // Tick function
        onUpdate(() => {
            // QOL click and hold
            if (isMousePressed())
            {
                mousePressed = true
            }
            // Shooting pollen
            if (isMouseDown() && mousePressed)
            {
                if (ammoCount.GetAmmo() >= 1)
                {
                //let dir = mousePos().sub(player.worldPos()).unit()
                
                let dir = mousePos().sub(player.worldPos()).scale(-1).unit()
                ammoCount.DecreaseAmmo(1)
                createPollen(player.worldPos(), dir)
                player.push(dir.scale(-POLLEN_PUSH))

                stats.pollen_fired++
                }
                else // Force release and reclick once out of pollen
                {
                    mousePressed = false
                }
            }

            CreateEnemies()

            // Loss condition
            // let intersections = 0;
            // outerSegments.forEach(([start, end], i) => {
            //     intersections += rightCrosses(player.worldPos(), start, end)
            // });
            // console.log(intersections)
            // if (intersections % 2 == 0)
            // {                
            //     player.takedamage(1)
            //     player.worldPos(center)
            //     player.setVelocity(vec2(0, -1000))
            // }


        });
    });
}

