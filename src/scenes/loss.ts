import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"

export function mountLossScene() {
    const textPos = center();
    textPos.y -= 40 
    scene("loss", () => {
        add([
            text("YOU LOST"),
            pos(textPos),
            scale(3),
            anchor("center"),
        ]);
        onClick(() => go("game"));
    })
}
