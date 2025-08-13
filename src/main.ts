import kaplay from "kaplay";
import "kaplay/global"; 

import {mountGameScene} from "./scenes/game";
import {mountLossScene} from "./scenes/loss";
import {mountMenuScene} from "./scenes/menu";

export const MAX_DT = .0130
export const SCREEN_WIDTH = 960
export const SCREEN_HEIGHT = 640

export const PADDING_VERT = 60
export const PADDING_HORIZ = 60
export const BORDER_THICKNESS = 16

export const FLOWER_SPACING = 14
export const GRAVITY = 15000
export const BUMP_SPEED = 30000
export const ROTATION_FACTOR = 500
export const POLLEN_SPEED = 10000
export const POLLEN_PUSH = 500 * 1

export const POLLEN_CAPACITY = 3000
export const POLLEN_RECHARGE_RATE = 3

export const HEALTH_CAPACITY = 16
export const HEART_SPACING = 50
export const HEART_BORDER_THICKNESS = 4
export const INVINC_DURATION = 2

// TODO: Add scoreboard
// TODO: Fix double bump count?
// TODO: Fix issue where shots not registering when clicking off of the game screen.
// TODO: FIX LAG ISSUE?

export const deltaT = () => {return clamp(dt(), 0, MAX_DT)}

const game: HTMLElement = document.getElementById("game");
kaplay({
    //width: SCREEN_WIDTH,
    //height: SCREEN_HEIGHT,
    canvas: document.querySelector("canvas"),
    debugKey: "0",
    //root: game
});

loadRoot("./"); // A good idea for Itch.io publishing later

mountMenuScene();
mountGameScene();
mountLossScene();

go("menu");
