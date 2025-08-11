import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"

export function mountMenuScene() {
    const textPos = center();
    textPos.y -= 40 
    scene("menu", () => {
        add([
            text("TUMBLEBEE"),
            pos(textPos),
            scale(2),
            anchor("center"),
            color(BLACK)
        ]);

        const startBtn = add([
            rect(300, 50),
            pos(textPos.add(vec2(0, 150))),
            area(),
            anchor("center"),
            outline(4),
            color(BLACK)
        ])

        startBtn.add([
            text("START"),
            pos(0),
            anchor("center"),
            color(WHITE)
        ])

        startBtn.onClick(() => go("game"));
    })
}