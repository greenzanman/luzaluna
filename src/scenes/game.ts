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
import {createPlayer} from "../game_objects/player"
import {createFlower} from "../game_objects/flower"
import {createPollen} from "../game_objects/pollen"
import {createBorder} from "../game_objects/border"
import { createHex } from "../game_objects/hexagon"

import {createHeart} from "../game_objects/heart"
import {createHealthBar} from "../game_objects/healthBar"

import {createPollenCount} from "../game_objects/pollenCount"

import {createCustomTimer} from "../game_objects/timer"

import {createBumpCount} from "../game_objects/bumpCount"

import {createArrow} from "../game_objects/arrow"

export function mountGameScene() {
    scene("game", () => {

        // Create border
        const borderWidth = SCREEN_WIDTH - PADDING_HORIZ * 2
        const borderHeight = SCREEN_HEIGHT - PADDING_VERT * 2
        const rect = canvas.getBoundingClientRect();
        const border = createBorder(vec2(rect.right / 2 - borderWidth / 2, rect.bottom / 2 - borderHeight / 2), borderWidth, borderHeight, BORDER_THICKNESS)
        const hex = createHex(vec2(rect.right / 2 - borderWidth / 2, rect.bottom / 2 - borderHeight / 2), borderWidth, borderHeight, BORDER_THICKNESS)

        // Create player
        const player = createPlayer(borderWidth / 2, borderHeight / 2, border);

        // Create arrow
        const arrow = createArrow(player)

        // Generates array of pairs of neighboring points.
        // TODO: Find way to set flower types programatically (or just do it manually idk)
        const segments = hex.pts.map((pt, i, arr) => [pt, arr[(i + 1) % arr.length]]);

        // For each segment interpolate the flowers along the segment.
        const increment = 20
        segments.forEach(([start, end]) => {
            Array.from({ length: increment }).forEach((_, j) => {
                const position = vec2(lerp(start.x, end.x, j / 20),lerp(start.y, end.y, j / 20));
                createFlower(position, 3, player, border);
            });
        });

        
        /*
        // Create flowers
        for (let i = 0; i < borderWidth - BORDER_THICKNESS; i += FLOWER_SPACING) {
            // Top flowers
            createFlower(FLOWER_SPACING / 2 + i, FLOWER_SPACING / 2, 3, player, border)

            // Bottom flowers
            createFlower(FLOWER_SPACING / 2 + i, borderHeight - FLOWER_SPACING / 2, 1, player, border)
        }
    
        for (let i = 0; i < borderHeight - BORDER_THICKNESS; i += FLOWER_SPACING) {
            // Left flowers
            createFlower(FLOWER_SPACING / 2, FLOWER_SPACING / 2 + i, 0, player, border)

            // Right flowers
            createFlower(borderWidth - FLOWER_SPACING / 2, FLOWER_SPACING / 2 + i, 2, player, border)
        }
        */

        // Create health bar
        const healthBar = createHealthBar(-BORDER_THICKNESS / 2, -BORDER_THICKNESS / 2, 40, border)
0
        // Create hearts
        let i = 0
        for (let j = 0; i < SCREEN_WIDTH - PADDING_HORIZ && j < HEALTH_CAPACITY; i += HEART_SPACING, j++) {
            createHeart(10 + i, -10, 4, BLACK, healthBar)
        }

        // Create timer
        const customTimer = createCustomTimer(10 + i, -30, "Time: 0", time(), border);

        // Create pollen count
        const pollenCount = createPollenCount(150 + i,-30, "Pollens: 2", border)

        // Creat bump count
        const bumpCount = createBumpCount(300 + i, -30, "Bumps: 0", border)

        

        // Regening pollen function
        loop(POLLEN_RECHARGE_RATE, () => {
            pollenCount.increasePollens();
        })

        // Bump event listener
        on("bump", "*", () => {
            pollenCount.increasePollens();
            bumpCount.increaseBumps();
        })

        // Decreases health when player gets hurt.
        player.onHurt((damage) => {
            let heart = healthBar.get("heart").findLast((heart) => heart.getHeartState())
            if(heart) {heart.setHeartState(false);}

            if(player.hp() <= 0) {
                go("loss", customTimer.getTime(), bumpCount.getBumps());
                //player.trigger("death")
            }
        })

        // Goes to loss scene when player dies.
        /*
        player.onDeath(() => {
            debug.log("Death")
            go("loss");
        })
        */

        document.addEventListener("mousemove", (event: MouseEvent) => {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
        });
    
        // Tick function
        onUpdate(() => {
            // Shooting pollen
            if (isMouseDown() && pollenCount.getPollens())
            {
                let dir = mousePos().sub(player.worldPos()).scale(-1).unit()
                createPollen(player.worldPos(), dir)
                player.push(dir.scale(-POLLEN_PUSH))

                pollenCount.decreasePollens();
            }
    
            // Loss condition
            const playerPos = player.worldPos()
            if ( playerPos.x < rect.right / 2 - borderWidth / 2 || // Left Bound
                playerPos.x  > rect.right / 2 + borderWidth / 2  || // Right Bound
                playerPos.y > rect.bottom / 2 + borderHeight / 2  ||  // Bottom Bound
                playerPos.y < rect.bottom / 2 - borderHeight / 2) // Top Bound
            {
                go("loss", customTimer.getTime(), bumpCount.getBumps());
            }
        });
    });
}

