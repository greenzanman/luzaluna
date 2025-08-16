import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"
import {Stats} from "./game"

export function mountLossScene() {
    setBackground(75, 75, 75)
    scene("loss", (stats: Stats, bestScore: number) => {
        const textPos = center();
        textPos.y -= 200
        textPos.x -= 450
        
        const score = Math.round(stats.time * 10
                + stats.bumps * 50
                + stats.wasp_kills * 100
                + stats.bigWasp_kills * 10 
                + stats.pollen_fired * 1 
                + stats.flower_blooms * 5)

        bestScore = Math.max(bestScore, score)

        const statText = `${bestScore == score ? "NEW BEST:" : "YOU LOST:"}
Best Score:${bestScore}
Time:${stats.time}
Bumps:${stats.bumps}
Wasps Killed:${stats.wasp_kills}
Big Wasps Killed:${stats.bigWasp_kills}
Pollen Fired:${stats.pollen_fired}
Flowers Bloomed:${stats.flower_blooms}

Score:${score}
`;
        const statTextArr = statText.split("\n");
        const statBoard = add([
            text(""),
            pos(textPos),
            scale(.75),
            color(220, 202, 105)
        ]);


        const retryBtn = add([
            rect(350, 50, {fill: false}),
            pos(textPos.add(vec2(200, 335))),
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

        retryBtn.onClick(() => go("game", bestScore));

        const menuBtn = add([
            rect(350, 50, {fill: false}),
            pos(textPos.add(vec2(200, 400))),
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

        menuBtn.onClick(() => go("menu", bestScore));

        const ratingAnoteText = add([
                    text(""),
                    scale(1),
                    pos(textPos.add(vec2(675, 80))),
                    anchor("center"),
                    color(220, 202, 105)
                ])

        const ratingText = add([
                    text(""),
                    scale(3),
                    pos(textPos.add(vec2(675, 150))),
                    anchor("center"),
                    color(220, 202, 105)
                ])

        let i = 0
        loop(.25, () => {
            if(i < statTextArr.length) {
                statBoard.text += statTextArr[i] + "\n"
            } else {
                
                let rating = ""
                if (score > 100000) {
                    rating = "TUMBLEBEE"
                } else if(score > 50000) {
                    rating = "BEEZZZ"
                } else if (score > 10000) {
                    rating = "BEEZ"
                } else if (score > 5000) {
                    rating = "BUZZ"
                } else if (score > 1000) {
                    rating = "BEE"
                } else {
                    rating = "B"
                }
                let j = -1
                loop(.5,() => {
                    if (j == -1) {
                        ratingAnoteText.text += "RANK:"
                    } else {
                        ratingText.text += rating[j]
                    }
                    j++
                }, rating.length + 1)
            }
            i++
        }, statTextArr.length + 1)
    })
}
