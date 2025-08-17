import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH, COLOR_BR, COLOR_BG, COLOR_BB, COLOR_AR, COLOR_AG, COLOR_AB} from "../main"
import {Stats} from "./game"

export function mountLossScene() {
    setBackground(color(COLOR_AR, COLOR_AG, COLOR_AB).color)
    scene("loss", (stats: Stats, bestScore: number) => {
        loadSound("start", "twee.mp3")
        loadSound("type", "type.mp3")
        const music = play("loss", {loop: true})
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
Hornets Killed:${stats.bigWasp_kills}
Pollen Fired:${stats.pollen_fired}
Flowers Bloomed:${stats.flower_blooms}

Score:${score}
`;
        const statTextArr = statText.split("\n");
        const statBoard = add([
            text(""),
            pos(textPos),
            scale(.75),
            color(COLOR_BR, COLOR_BG, COLOR_BB)
        ]);


        const retryBtn = add([
            rect(350, 50),
            pos(textPos.add(vec2(200, 335))),
            area(),
            anchor("center"),
            outline(4, color(COLOR_BR, COLOR_BG, COLOR_BB).color),
            color(COLOR_AR, COLOR_AG, COLOR_AB)
        ])

        retryBtn.add([
            text("Retry"),
            pos(0),
            anchor("center"),
            color(COLOR_BR, COLOR_BG, COLOR_BB),
            "text"
        ])

        retryBtn.onClick(() => {
            play("start")
            music.stop()
            go("game", bestScore)
        });

        retryBtn.onHover(() => {
            play("hover", {volume: .5})
            retryBtn.color = color(COLOR_BR, COLOR_BG, COLOR_BB).color
            retryBtn.outline.color = color(COLOR_AR, COLOR_AG, COLOR_AB).color
            retryBtn.get("text")[0].color = color(COLOR_AR, COLOR_AG, COLOR_AB).color
        });

        retryBtn.onHoverEnd(() => {
            retryBtn.color = color(COLOR_AR, COLOR_AG, COLOR_AB).color
            retryBtn.outline.color = color(COLOR_BR, COLOR_BG, COLOR_BB).color
            retryBtn.get("text")[0].color = color(COLOR_BR, COLOR_BG, COLOR_BB).color
        });

        const menuBtn = add([
            rect(350, 50),
            pos(textPos.add(vec2(200, 400))),
            area(),
            anchor("center"),
            outline(4, color(COLOR_BR, COLOR_BG, COLOR_BB).color),
            color(COLOR_AR, COLOR_AG, COLOR_AB)
        ])

        menuBtn.add([
            text("Back to Menu"),
            pos(0),
            anchor("center"),
            color(COLOR_BR, COLOR_BG, COLOR_BB),
            "text"
        ])

        menuBtn.onClick(() => {
            play("start")
            music.stop()
            go("menu", bestScore)
        });

        menuBtn.onHover(() => {
            play("hover", {volume: .5})
            menuBtn.color = color(COLOR_BR, COLOR_BG, COLOR_BB).color
            menuBtn.outline.color = color(COLOR_AR, COLOR_AG, COLOR_AB).color
            menuBtn.get("text")[0].color = color(COLOR_AR, COLOR_AG, COLOR_AB).color
        });

        menuBtn.onHoverEnd(() => {
            menuBtn.color = color(COLOR_AR, COLOR_AG, COLOR_AB).color
            menuBtn.outline.color = color(COLOR_BR, COLOR_BG, COLOR_BB).color
            menuBtn.get("text")[0].color = color(COLOR_BR, COLOR_BG, COLOR_BB).color
        });


        const ratingAnoteText = add([
                    text(""),
                    scale(1),
                    pos(textPos.add(vec2(675, 80))),
                    anchor("center"),
                    color(COLOR_BR, COLOR_BG, COLOR_BB)
                ])

        const ratingText = add([
                    text(""),
                    scale(3),
                    pos(textPos.add(vec2(675, 150))),
                    anchor("center"),
                    color(COLOR_BR, COLOR_BG, COLOR_BB)
                ])

        let i = 0
        loop(.25, () => {
            if(i < statTextArr.length) {
                statBoard.text += statTextArr[i] + "\n"
                if(statTextArr[i] != "") {
                    play("type")
                }
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
                        play("type")
                    } else {
                        ratingText.text += rating[j]
                        play("type")
                    }
                    j++
                }, rating.length + 1)
            }
            i++
        }, statTextArr.length + 1)
    })
}
