import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"
import {Stats} from "./game"

export function mountLossScene() {
    const textPos = center();
    textPos.y -= 80
    textPos.x -= 200
    scene("loss", (stats: Stats, bestTime: number, bestBumps: number) => {
        bestTime = Math.max(bestTime, stats.time)
        bestBumps = Math.max(bestBumps, stats.bumps)
        add([
            text(`
                ${bestTime == stats.time || bestBumps == stats.bumps ? "NEW BEST:" : "YOU LOST"}
                Best Time:${bestTime}
                Best Bumps:${bestBumps}
                Time:${stats.time}
                Bumps:${stats.bumps}
                Wasps Killed:${stats.wasp_kills}
                Big Wasps Killed:${stats.bigWasp_kills}
                Pollen Fired:${stats.pollen_fired}
                Flowers Bloomed:${stats.flower_blooms}`),
            pos(textPos),
            scale(.75),
            anchor("center"),
            color(BLACK)
        ]);

        const retryBtn = add([
            rect(350, 50),
            pos(textPos.add(vec2(200, 300))),
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

        retryBtn.onClick(() => go("game", bestTime, bestBumps));

        const menuBtn = add([
            rect(350, 50),
            pos(textPos.add(vec2(200, 365))),
            area(),
            anchor("center"),
            outline(4),
            color(BLACK)
        ])

        menuBtn.add([
            text("Back to Menu"),
            pos(0),
            anchor("center"),
            color(WHITE)
        ])

        menuBtn.onClick(() => go("menu", bestTime, bestBumps));


    })
}
