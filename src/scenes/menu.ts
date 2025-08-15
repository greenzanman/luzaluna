import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../main";

export function mountMenuScene() {
    const textPos = center();
    textPos.y -= 40 
    scene("menu", (bestTime: number, bestBumps: number) => {
        loadSprite("title", "title.png")
        add([
            sprite("title", {width: SCREEN_WIDTH, height: SCREEN_HEIGHT}),
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

        startBtn.onClick(() => go("game", bestTime, bestBumps));
    })
}