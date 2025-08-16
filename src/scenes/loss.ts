import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"
import {Stats} from "./game"

export function mountLossScene() {
    setBackground(75, 75, 75)
    scene("loss", (stats: Stats, bestTime: number, bestBumps: number) => {
        const textPos = center();
        textPos.y -= 200
        textPos.x -= 450
        bestTime = Math.max(bestTime, stats.time)
        bestBumps = Math.max(bestBumps, stats.bumps)
        const statText = `${bestTime == stats.time || bestBumps == stats.bumps ? "NEW BEST:" : "YOU LOST:"}
Best Time:${bestTime}
Best Bumps:${bestBumps}
Time:${stats.time}
Bumps:${stats.bumps}
Wasps Killed:${stats.wasp_kills}
Big Wasps Killed:${stats.bigWasp_kills}
Pollen Fired:${stats.pollen_fired}
Flowers Bloomed:${stats.flower_blooms}
`;
        const statTextArr = statText.split("\n");
        const statBoard = add([
            text(""),
            pos(textPos),
            scale(.75),
            color(220, 202, 105)
        ]);

        let i = 0
        loop(.25, () => {
            statBoard.text += statTextArr[i] + "\n"
            i++
        }, statTextArr.length - 1)

        const retryBtn = add([
            rect(350, 50, {fill: false}),
            pos(textPos.add(vec2(200, 300))),
            area(),
            anchor("center"),
            outline(4, color(220, 202, 105).color),
            
        ])

        retryBtn.add([
            text("Retry"),
            pos(0),
            anchor("center"),
            color(220, 202, 105)
        ])

        retryBtn.onClick(() => go("game", bestTime, bestBumps));

        const menuBtn = add([
            rect(350, 50, {fill: false}),
            pos(textPos.add(vec2(200, 365))),
            area(),
            anchor("center"),
            outline(4, color(220, 202, 105).color),
            color(220, 202, 105)
        ])

        menuBtn.add([
            text("Back to Menu"),
            pos(0),
            anchor("center"),
            color(220, 202, 105)
        ])

        menuBtn.onClick(() => go("menu", bestTime, bestBumps));


    })
}
