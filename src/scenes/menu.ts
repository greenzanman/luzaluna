export function mountMenuScene() {
    const textPos = center();
    textPos.y -= 40 
    scene("menu", (bestTime, bestBumps) => {
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

        startBtn.onClick(() => go("game", bestTime, bestBumps));
    })
}