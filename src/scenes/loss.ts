import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"

export function mountLossScene() {
    const textPos = center();
    textPos.y -= 40 
    scene("loss", (time) => {
        add([
            text("YOU LOST:" + time),
            pos(textPos),
            scale(1.5),
            anchor("center"),
        ]);
        onClick(() => go("game"));
    })
}
