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
import { ArcFlightComp } from "../game_objects/arcFlight"
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

export function mountGameScene() {
    scene("game", () => {
        // Create player
        const player = createPlayer(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        const arrow = createArrow(player)
        const arcFlight = ArcFlightComp(player);
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
            const flowerType = i
            Array.from({ length: FLOWER_SPACING }).forEach((_, j) => {
                const position = vec2(lerp(start.x, end.x, j / FLOWER_SPACING),lerp(start.y, end.y, j / FLOWER_SPACING));
                flowers.push(createFlower(position, vec2((end.y - start.y), -(end.x-start.x)), player, hex));
            });
        });


        // Create border    
        const customTimer = createCustomTimer(SCREEN_WIDTH - PADDING_HORIZ - 350, HEART_SPACING / 2 + PADDING_VERT - 70, "Time: 0", time());

        // Create pollen count
        const ammoCount = createAmmoCount(vec2(SCREEN_WIDTH - PADDING_HORIZ - 150, HEART_SPACING / 2 + PADDING_VERT - 70), 150, 50)

        // Creat bump count
        const bumpCount = createBumpCount(SCREEN_WIDTH - PADDING_HORIZ - 225, HEART_SPACING / 2 + PADDING_VERT - 70, "Bumps: 0")

        // Create health bar
        const healthBar = createHealthBar(PADDING_HORIZ, HEART_SPACING / 2 + PADDING_VERT - 85, 40)
        // Create hearts
        for (let i = 0, j = 0; j < HEALTH_CAPACITY; i += HEART_SPACING, j++) {
            createHeart(HEART_SPACING / 2 + i, HEART_SPACING / 2, 4, BLACK, healthBar)
        }

        // Bump event listener
        on("bump", "*", () => {
            ammoCount.IncreaseAmmo(POLLEN_CAPACITY / 2);
            bumpCount.increaseBumps();
        })

        // Decreases health when player gets hurt.
        player.onHurt((damage) => {
            let heart = healthBar.get("heart").findLast((heart) => heart.getHeartState())
            if(heart) {heart.setHeartState(false);}

            // Emit particles
            // debug.log("Emitting particles (unimplemented");
            player.emitParticles(10)

            debug.log("HP: " + player.hp())

            if(player.hp() <= 0) {
                go("loss", customTimer.getTime(), bumpCount.getBumps());
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
                    createBigWasp(spawnLoc, player,
                        center, vec2(SCREEN_WIDTH, SCREEN_HEIGHT)
                    );
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
                    createWasp(spawnLoc, player)
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
        const INACCURACY_FLOOR = 0.5
        const INACCURACY_COEF = 1
        const INACCURACY_MAX = 0.8

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
                        // Calculate dynamic delay based on ammo
                        const minDelay = 0.1; // Fastest fire rate
                        const maxDelay = 0.8; // Slowest fire rate
                        const ammo = ammoCount.GetAmmo();
                        const ammoRatio = ammo / POLLEN_CAPACITY;
                        const delay = lerp(maxDelay, minDelay, Math.sqrt(ammoRatio ** 0.01));
                        pollenDelay = delay; // slower firing rate when low on ammo


                        ammoCount.DecreaseAmmo(1*shootingDuration)  // use more ammo the longer u held down

                        let inaccuracyVal = Math.min(shootingDuration, INACCURACY_MAX);
                        inaccuracyVal = Math.max(inaccuracyVal - INACCURACY_FLOOR, 0) * INACCURACY_COEF
                        let inaccuracyOffset = vec2(rand(-inaccuracyVal, inaccuracyVal), rand(-inaccuracyVal, inaccuracyVal))

                        aimDirection = rawTargetDirection.add(inaccuracyOffset);
                        createPollen(player.worldPos(), aimDirection.scale(POLLEN_SPEED))


                        const minPush = POLLEN_PUSH;      // normal push at full ammo
                        const maxPush = POLLEN_PUSH ** 2;  // stronger push at zero ammo
                        const pushStrength = lerp(minPush, maxPush, 1 - ammoRatio);
                        player.push(aimDirection.scale(-pushStrength))

                        playerShot = true;
                    }
                }
                else // Force release and reclick once out of pollen
                {
                    mousePressed = false
                    pollenDelay = 5
                }
                shootingDuration += dt()
            }
            else
            {
                shootingDuration = 0   
            }

            // If player not shooting, smoothly snap aim direction to target
            if (playerShot == false)
                    aimDirection = aimDirection.lerp(rawTargetDirection, lerpAimFactor).unit();

            CreateEnemies()

            arcFlight.applyArcFlight(player);

        });

        // Pass aimDirection to arrowComp
        arrow.aimDirection = () => aimDirection;
    });
}

