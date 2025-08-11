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
    PADDING_HORIZ
} from "../main"
import {createPlayer} from "../game_objects/player"
import {createFlower} from "../game_objects/flower"
import {createPollen} from "../game_objects/pollen"

export function mountGameScene() {
    scene("game", () => {
        let current_pollens = POLLEN_CAPACITY;
        const player = createPlayer(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    
        for (let i = PADDING_HORIZ; i < SCREEN_WIDTH - PADDING_HORIZ; i += FLOWER_SPACING) {
            // Bottom flowers
            createFlower(FLOWER_SPACING / 2 + i, FLOWER_SPACING / 2 + PADDING_VERT, 3, player)

            // Top flowers
            createFlower(FLOWER_SPACING / 2 + i, SCREEN_HEIGHT - FLOWER_SPACING / 2 - PADDING_VERT, 1, player)
        }
    
        for (let i = PADDING_VERT; i < SCREEN_HEIGHT - PADDING_VERT; i += FLOWER_SPACING) {
            // Left flowers
            createFlower(FLOWER_SPACING / 2 + PADDING_HORIZ, FLOWER_SPACING / 2 + i, 0, player)

            // Right flowers
            createFlower(SCREEN_WIDTH - FLOWER_SPACING / 2 - PADDING_HORIZ, FLOWER_SPACING / 2 + i, 2, player)
        }

        // Regening pollen function
        loop(POLLEN_RECHARGE_RATE, () => {
            current_pollens = increasePollensOnNotFull(current_pollens);
        })

        on("bump", "*", () => {
            current_pollens = increasePollensOnNotFull(current_pollens);
        })
    
        // Tick function
        onUpdate(() => {
            // Shooting pollen
            if (isMousePressed() && current_pollens)
            {
                let dir = mousePos().sub(player.worldPos()).unit()
                createPollen(player.worldPos(), dir)
                player.push(dir.scale(-POLLEN_PUSH))
                current_pollens--
            }
    
            // Loss condition
            if (player.worldPos().x < 0 || player.worldPos().x > SCREEN_WIDTH ||
                player.worldPos().y < 0 || player.worldPos().y > SCREEN_HEIGHT)
            {
                go("loss");
            }
            debug.log("Pollens:", current_pollens);
        });
    });
}


const increasePollensOnNotFull = (current_pollens) => {
    return current_pollens = current_pollens != POLLEN_CAPACITY ? current_pollens + 1: current_pollens;
}