import {pos} from "./Position";

/**
 * Describes the shape of a piece.
 */
class Shape {
    constructor(positions, color) {
        this.positions = positions;
        this.color = color;
    }

    rotateClockwise() {
        const newPositions = this.positions.map(p => p.rotateClockwise());
        return new Shape(newPositions, this.color);
    }
}

/**
 * The "O" character shows the origin (center) of the shape, around
 * which the shape rotates.
 *
 * XOXX
 */
export const LINE = new Shape([pos(-1, 0), pos(0, 0), pos(1, 0), pos(2, 0)], "cyan");

/**
 * X
 * XOX
 */
export const LEFTY = new Shape([pos(-1, -1), pos(-1, 0), pos(0, 0), pos(1, 0)], "blue");

/**
 *   X
 * XOX
 */
export const RIGHTY = new Shape([pos(1, -1), pos(-1, 0), pos(0, 0), pos(1, 0)], "orange");

/**
 * XX
 * OX
 */
export const SQUAREY = new Shape([pos(0, -1), pos(1, -1), pos(0, 0), pos(1, 0)], "yellow");

/**
 *  XX
 * XO
 */
export const STEP_UP = new Shape([pos(0, -1), pos(1, -1), pos(-1, 0), pos(0, 0)], "green");

/**
 * XX
 *  OX
 */
export const STEP_DOWN = new Shape([pos(-1, -1), pos(0, -1), pos(0, 0), pos(1, 0)], "red");

/**
 *  X
 * XOX
 */
export const PYRAMID = new Shape([pos(0, -1), pos(-1, 0), pos(0, 0), pos(1, 0)], "indigo");

const ALL_SHAPES = [LINE, LEFTY, RIGHTY, SQUAREY, STEP_UP, STEP_DOWN, PYRAMID];

export function pickRandomShape() {
    const index = getRandomInt(ALL_SHAPES.length);
    return ALL_SHAPES[index];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
