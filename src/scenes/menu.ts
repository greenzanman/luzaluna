import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../main";

export function mountMenuScene() {
    const textPos = center();
    textPos.y -= 40 
    scene("menu", (bestScore: number) => {
        loadSound("bees", "bees.mp3")
        loadSound("start", "twee.mp3")
        loadSound("hover", "twee2.mp3")
        loadSprite("title", "title.png")
        const beeSound = play("bees", {loop: true})
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
            color(220, 202, 105),
            "text"
        ])

        startBtn.onClick(() => {
            play("start")
            beeSound.stop()
            go("game", bestScore)
        });

        startBtn.onHover(() => {
            play("hover", {volume: .5})
            startBtn.color = color(220, 202, 105).color
            startBtn.outline.color = color(75, 75, 75).color
            startBtn.get("text")[0].color = color(75, 75, 75).color
        });

        startBtn.onHoverEnd(() => {
            startBtn.color = color(75, 75, 75).color
            startBtn.outline.color = color(220, 202, 105).color
            startBtn.get("text")[0].color = color(220, 202, 105).color
        });
    })
}