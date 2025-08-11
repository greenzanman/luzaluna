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

import {createHeart} from "../game_objects/heart"
import {createHealthBar} from "../game_objects/healthBar"

import {createPollenCount} from "../game_objects/pollenCount"

import {createCustomTimer} from "../game_objects/timer"

import {createBumpCount} from "../game_objects/bumpCount"

export function mountGameScene() {
    scene("game", () => {
        // Create player
        const player = createPlayer(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        
        // Create flowers
        for (let i = PADDING_HORIZ; i < SCREEN_WIDTH - PADDING_HORIZ; i += FLOWER_SPACING) {
            // Top flowers
            createFlower(FLOWER_SPACING / 2 + i, FLOWER_SPACING / 2 + PADDING_VERT, 3, player)

            // Bottom flowers
            createFlower(FLOWER_SPACING / 2 + i, SCREEN_HEIGHT - FLOWER_SPACING / 2 - PADDING_VERT, 1, player)
        }
    
        for (let i = PADDING_VERT; i < SCREEN_HEIGHT - PADDING_VERT; i += FLOWER_SPACING) {
            // Left flowers
            createFlower(FLOWER_SPACING / 2 + PADDING_HORIZ, FLOWER_SPACING / 2 + i, 0, player)

            // Right flowers
            createFlower(SCREEN_WIDTH - FLOWER_SPACING / 2 - PADDING_HORIZ, FLOWER_SPACING / 2 + i, 2, player)
        }

        // Create border
        createBorder(vec2(PADDING_HORIZ, PADDING_VERT), SCREEN_WIDTH - PADDING_HORIZ * 2, SCREEN_HEIGHT - PADDING_VERT * 2, BORDER_THICKNESS)

        // Create timer
        const customTimer = createCustomTimer(SCREEN_WIDTH - PADDING_HORIZ - 350, HEART_SPACING / 2 + PADDING_VERT - 70, "Time: 0", time());

        // Create pollen count
        const pollenCount = createPollenCount(SCREEN_WIDTH - PADDING_HORIZ - 150, HEART_SPACING / 2 + PADDING_VERT - 70, "Pollens: 2")

        // Creat bump count
        const bumpCount = createBumpCount(SCREEN_WIDTH - PADDING_HORIZ - 225, HEART_SPACING / 2 + PADDING_VERT - 70, "Bumps: 0")

        // Create health bar
        const healthBar = createHealthBar(PADDING_HORIZ, HEART_SPACING / 2 + PADDING_VERT - 85, 40)
0
        // Create hearts
        for (let i = 0, j = 0; i < SCREEN_WIDTH - PADDING_HORIZ && j < HEALTH_CAPACITY; i += HEART_SPACING, j++) {
            createHeart(HEART_SPACING / 2 + i, HEART_SPACING / 2, 4, BLACK, healthBar)
        }

        

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
    
        // Tick function
        onUpdate(() => {
            // Shooting pollen
            if (isMousePressed() && pollenCount.getPollens())
            {
                let dir = mousePos().sub(player.worldPos()).unit()
                createPollen(player.worldPos(), dir)
                player.push(dir.scale(-POLLEN_PUSH))

                pollenCount.decreasePollens();
            }
    
            // Loss condition
            if (player.worldPos().x < 0 || player.worldPos().x > SCREEN_WIDTH ||
                player.worldPos().y < 0 || player.worldPos().y > SCREEN_HEIGHT)
            {
                go("loss", customTimer.getTime(), bumpCount.getBumps());
            }
            //debug.log("Pollens:", player.curr_pollens);
        });
    });
}

