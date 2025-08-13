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
    HEALTH_CAPACITY,
    INVINC_DURATION
} from "../main"
import {createPlayer} from "../game_objects/player"
import {createFlower} from "../game_objects/flower"
import {createPollen} from "../game_objects/pollen"
import {createBorder} from "../game_objects/border"
import {createHexBorder} from "../game_objects/hexBorder"

import {createHeart} from "../game_objects/heart"
import {createHealthBar} from "../game_objects/healthBar"

import {createPollenCount} from "../game_objects/pollenCount"

import {createCustomTimer} from "../game_objects/timer"

import {createBumpCount} from "../game_objects/bumpCount"

import {createArrow} from "../game_objects/arrow"

export function mountGameScene() {
    scene("game", () => {
        const rect = canvas.getBoundingClientRect();
        // Create border
        const borderWidth = SCREEN_WIDTH - PADDING_HORIZ * 2
        const borderHeight = SCREEN_HEIGHT - PADDING_VERT * 2
        const borderPos = vec2(rect.right / 2 - borderWidth / 2, rect.bottom / 2 - borderHeight / 2)

        const hex = createHexBorder(borderPos, borderWidth, borderHeight, BORDER_THICKNESS)

        // Create player
        const player = createPlayer(borderWidth / 2, borderHeight / 2, hex);

        // Create arrow
        const arrow = createArrow(player)

        // Generates array of pairs of neighboring points.
        // TODO: Find way to set flower types programatically (or just do it manually idk)
        const segments = hex.pts.map((pt, i, arr) => [pt, arr[(i + 1) % arr.length]]);

        // For each segment interpolate the flowers along the segment.
        segments.forEach(([start, end], i) => {
            const flowerType = i
            Array.from({ length: FLOWER_SPACING }).forEach((_, j) => {
                const position = vec2(lerp(start.x, end.x, j / FLOWER_SPACING),lerp(start.y, end.y, j / FLOWER_SPACING));
                createFlower(position, flowerType, player, hex);
            });
            

        });

        // Create health bar
        const healthBar = createHealthBar(-BORDER_THICKNESS / 2, -BORDER_THICKNESS / 2, 40, hex)
0
        // Create hearts
        let i = 0
        for (let j = 0; j < HEALTH_CAPACITY; i += HEART_SPACING, j++) {
            createHeart(10 + i, -10, 4, BLACK, healthBar)
        }

        // Create timer
        const customTimer = createCustomTimer(10 + i, -30, "Time: 0", time(), hex);

        // Create pollen count
        const pollenCount = createPollenCount(150 + i,-30, "Pollens: 2", hex)

        // Creat bump count
        const bumpCount = createBumpCount(300 + i, -30, "Bumps: 0", hex)

        

        // Regening pollen function
        pollenCount.loop(POLLEN_RECHARGE_RATE, () => {
            pollenCount.increasePollens();
        })

        // Bump event listener
        on("bump", "*", () => {
            pollenCount.increasePollens();
            bumpCount.increaseBumps();
        })

        // Decreases health when player gets hurt.
        player.onHurt((damage) => {
            // Updates heart UI
            let heart = healthBar.get("heart").findLast((heart) => heart.getHeartState())
            if(heart) {heart.setHeartState(false);}

            // Makes player invincible and starts timer to make them vulnerable again.
            player.setPlayerState(1);
            player.wait(INVINC_DURATION, () => {player.setPlayerState(0)});

            // Emit particles
            debug.log("Emitting particles");
            player.emitParticles(10)

            // Checks death condition.
            if(player.hp() <= 0) {
                go("loss", customTimer.getTime(), bumpCount.getBumps());
            }
        })

        onMouseDown(() => {
            if (pollenCount.getPollens()) {
                let dir = mousePos().sub(player.worldPos()).scale(-1).unit()
                createPollen(player.worldPos(), dir, player.velocity.len())
                player.push(dir.scale(-POLLEN_PUSH))

                pollenCount.decreasePollens();
            }
        })
    
        // Tick function
        onUpdate(() => {
    
            // If player clips out of the world
            const playerPos = player.worldPos()
            if ( playerPos.x < borderPos.x || // Left Bound
                playerPos.x  > borderPos.x + borderWidth  || // Right Bound
                playerPos.y > borderPos.y + borderHeight  ||  // Bottom Bound
                playerPos.y < borderPos.y) // Top Bound
            {
                debug.log("Out of bounds")
                player.pos = vec2(borderWidth / 2, borderHeight / 2)
            }
        });
    });
}

