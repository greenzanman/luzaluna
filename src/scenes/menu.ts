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
            color(75, 75, 75),
            outline(4, color(220, 202, 105).color),
        ])

        startBtn.add([
            text("START"),
            pos(0),
            anchor("center"),
            color(220, 202, 105)
        ])

        startBtn.onClick(() => go("game", bestTime, bestBumps));
    })
}