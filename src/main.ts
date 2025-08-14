import kaplay from "kaplay";
import "kaplay/global"; 

import {mountGameScene} from "./scenes/game"
import {mountLossScene} from "./scenes/loss"
import {mountMenuScene} from "./scenes/menu";

export const SCREEN_WIDTH = 640
export const SCREEN_HEIGHT = 480

export const PADDING_VERT = 60
export const PADDING_HORIZ = 20
export const BORDER_THICKNESS = 16

export const FLOWER_SPACING = 25
export const GRAVITY = 10000
export const BUMP_SPEED = 12000
export const ROTATION_FACTOR = 500
export const POLLEN_SPEED = 30000
export const POLLEN_PUSH = 300

export const POLLEN_CAPACITY = 30
export const POLLEN_RECHARGE_RATE = 6

export const HEALTH_CAPACITY = 4
export const HEART_SPACING = 50
export const HEART_BORDER_THICKNESS = 4

export const WASP_SPEED = 4000

export const INVUL_DURATION = 2

// TODO: Add scoreboard
// TODO: Add arrow cursor to aim
// TODO: Add current players velocity on top of pollen velocity?
// TODO: Add bar on top of player to show pollen count instead of a simple counter?
// TODO: Add i-frames (fixes double collision bug)
// TODO: Fix double bump count?
// TODO: Fix issue where shots not registering when clicking off of the game screen.


const game: HTMLElement = document.getElementById("game");
kaplay({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    debugKey: "0",
    root: game
});

loadRoot("./"); // A good idea for Itch.io publishing later

mountMenuScene();
mountGameScene();
mountLossScene();

go("menu", 0, 0);
