import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"

export function mountLossScene() {
    const textPos = center();
    textPos.y -= 40 
    scene("loss", (time, bumps) => {
        add([
            text("YOU LOST:" + "\nTime:" + time + "\nBumps:" + bumps),
            pos(textPos),
            scale(1.5),
            anchor("center"),
        ]);

        const retryBtn = add([
            rect(300, 50),
            pos(textPos.add(vec2(0, 150))),
            area(),
            anchor("center"),
            outline(4),
            color(BLACK)
        ])

        retryBtn.add([
            text("Retry"),
            pos(0),
            anchor("center"),
            color(WHITE)
        ])

        retryBtn.onClick(() => go("game"));
    })
}
