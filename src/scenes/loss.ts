import {SCREEN_WIDTH, SCREEN_HEIGHT, FLOWER_SPACING, GRAVITY, BUMP_SPEED, POLLEN_SPEED, POLLEN_PUSH} from "../main"
import {Stats} from "./game"

export function mountLossScene() {
    setBackground(75, 75, 75)
    scene("loss", (stats: Stats, bestScore: number) => {
        loadSound("start", "twee.mp3")
        loadSound("music", "beeutiful misery.mp3")
        loadSound("type", "type.mp3")
        const music = play("music", {loop: true})
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
            color(220, 202, 105)
        ]);


        const retryBtn = add([
            rect(350, 50),
            pos(textPos.add(vec2(200, 335))),
            area(),
            anchor("center"),
            outline(4, color(220, 202, 105).color),
            color(75, 75, 75)
        ])

        retryBtn.add([
            text("Retry"),
            pos(0),
            anchor("center"),
            color(220, 202, 105),
            "text"
        ])

        retryBtn.onClick(() => {
            play("start")
            music.stop()
            go("game", bestScore)
        });

        retryBtn.onHover(() => {
            play("hover", {volume: .5})
            retryBtn.color = color(220, 202, 105).color
            retryBtn.outline.color = color(75, 75, 75).color
            retryBtn.get("text")[0].color = color(75, 75, 75).color
        });

        retryBtn.onHoverEnd(() => {
            retryBtn.color = color(75, 75, 75).color
            retryBtn.outline.color = color(220, 202, 105).color
            retryBtn.get("text")[0].color = color(220, 202, 105).color
        });

        const menuBtn = add([
            rect(350, 50),
            pos(textPos.add(vec2(200, 400))),
            area(),
            anchor("center"),
            outline(4, color(220, 202, 105).color),
            color(75, 75, 75)
        ])

        menuBtn.add([
            text("Back to Menu"),
            pos(0),
            anchor("center"),
            color(220, 202, 105),
            "text"
        ])

        menuBtn.onClick(() => {
            play("start")
            music.stop()
            go("menu", bestScore)
        });

        menuBtn.onHover(() => {
            play("hover", {volume: .5})
            menuBtn.color = color(220, 202, 105).color
            menuBtn.outline.color = color(75, 75, 75).color
            menuBtn.get("text")[0].color = color(75, 75, 75).color
        });

        menuBtn.onHoverEnd(() => {
            menuBtn.color = color(75, 75, 75).color
            menuBtn.outline.color = color(220, 202, 105).color
            menuBtn.get("text")[0].color = color(220, 202, 105).color
        });


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
