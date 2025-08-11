import kaplay from "kaplay";
import type { Comp, Vec2 } from "kaplay";
import "kaplay/global"; 

import {createPlayer} from "./game_objects/player"
import {createFlower} from "./game_objects/flower"
import {createPollen} from "./game_objects/pollen"

import {mountGameScene} from "./scenes/game"
import {mountLossScene} from "./scenes/loss"

export const SCREEN_WIDTH = 640
export const SCREEN_HEIGHT = 480

export const PADDING_VERT = 60
export const PADDING_HORIZ = 20
export const BORDER_THICKNESS = 16

export const FLOWER_SPACING = 40
export const GRAVITY = 15000
export const BUMP_SPEED = 20000
export const POLLEN_SPEED = 30000
export const POLLEN_PUSH = 500

export const POLLEN_CAPACITY = 2
export const POLLEN_RECHARGE_RATE = 3

export const HEALTH_CAPACITY = 4
export const HEART_SPACING = 50
export const HEART_BORDER_THICKNESS = 4


const game: HTMLElement = document.getElementById("game");
kaplay({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    debugKey: "0",
    root: game
});

loadRoot("./"); // A good idea for Itch.io publishing later


mountGameScene();
mountLossScene();

go("game");
