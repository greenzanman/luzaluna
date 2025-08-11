import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"

export function mountLossScene() {
    scene("loss", () => {
        add([
            text("YOU LOST"),
            pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 80),
            scale(3),
            anchor("center"),
        ]);
        onClick(() => go("game"));
    })
}
