import { SCREEN_HEIGHT, SCREEN_WIDTH, COLOR_BR, COLOR_BG, COLOR_BB, COLOR_AR, COLOR_AG, COLOR_AB} from "../main";

export function mountMenuScene() {
    const textPos = center();
    textPos.y -= 40 
    scene("menu", (bestScore: number) => {
        loadSound("bees", "bees.mp3")
        loadSound("start", "twee.mp3")
        loadSound("hover", "twee2.mp3")
        loadSprite("title", "TITLECARD.png")
        loadSound("type", "type.mp3")
        const beeSound = play("bees", {loop: true})
        add([
            sprite("title", {width: SCREEN_WIDTH, height: SCREEN_HEIGHT}),
        ]);

        const startBtn = add([
            rect(300, 50),
            pos(textPos.add(vec2(0, 290))),
            area(),
            anchor("center"),
            color(COLOR_AR, COLOR_AG, COLOR_AB),
            outline(4, color(COLOR_BR, COLOR_BG, COLOR_BB).color),
        ])

        startBtn.add([
            text("START"),
            pos(0),
            anchor("center"),
            color(COLOR_BR, COLOR_BG, COLOR_BB),
            "text"
        ])

        startBtn.onClick(() => {
            play("start")
            beeSound.stop()
            go("game", bestScore)
        });

        startBtn.onHover(() => {
            play("hover", {volume: .5})
            startBtn.color = color(COLOR_BR, COLOR_BG, COLOR_BB).color
            startBtn.outline.color = color(COLOR_AR, COLOR_AG, COLOR_AB).color
            startBtn.get("text")[0].color = color(COLOR_AR, COLOR_AG, COLOR_AB).color
        });

        startBtn.onHoverEnd(() => {
            startBtn.color = color(COLOR_AR, COLOR_AG, COLOR_AB).color
            startBtn.outline.color = color(COLOR_BR, COLOR_BG, COLOR_BB).color
            startBtn.get("text")[0].color = color(COLOR_BR, COLOR_BG, COLOR_BB).color
        });

        // Load here rather than on game start
        loadSound("death", "explosion.mp3")
        loadSound("hurt", "explosion3.mp3")
        loadSound("explode", "explosion2.mp3")
        loadSound("shoot", "pew.mp3")
        loadSound("waspDeath", "burst.mp3")
        loadSound("bloom", "pluck.mp3")
        loadSound("buildUp", "buildup.mp3")
        loadSound("music", "music2.mp3")
        loadSound("loss", "beeutiful misery.mp3")
        loadSound("wasp", "mosquito.mp3")
        
        loadSprite("arrow", "flowerSheet.png", {
            sliceX: 4,
            sliceY: 2,
        })
        loadSprite("sparkSheet", "sparkSheet.png", {
            sliceX: 4,
            sliceY: 3,
        })
        loadSprite("flowerSheet", "flowerSheet.png", {
            sliceX: 4,
            sliceY: 2,
        })
        loadSprite("swirl", "swirl.png")
        loadSprite("pollen", "pollen.png")
        loadSprite("beeSheet", "beeSheet.png", {
            sliceX: 4,
            sliceY: 2,
            anims: {
                beeFly: { from: 0, to: 0},
                beeTumble: { from: 1, to: 5, loop: true}
            }
        })
        loadSprite("heartEmpty", "heartEmpty.png")
        loadSprite("heartFull", "heartFull.png")
        loadSprite("smallWasp", "smallWasp.png", {
            sliceX: 2,
            anims: {
                waspFly: { from: 0, to: 1, loop: true}
            }
        })
    })
}