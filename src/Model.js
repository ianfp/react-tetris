/**
 * A position on the game board.
 */
class Position {
    constructor(x, y) {
        this.x = x === 0 ? 0 : x;
        this.y = y === 0 ? 0 : y;
    }

    add(other) {
        return new Position(this.x + other.x, this.y + other.y);
    }

    plusX(x) {
        return new Position(this.x + x, this.y);
    }

    plusY(y) {
        return new Position(this.x, this.y + y);
    }

    rotateClockwise() {
        return new Position(-this.y, this.x);
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

/**
 * Convenience factory function for Position.
 */
export function pos(x, y) {
    return new Position(x, y);
}

/**
 * Describes the shape of a piece.
 *
 * "line"
 * OOOO [(0,0) (1,0) (2,0) (3,0)]
 *
 * "lefty"
 * O      x,y
 * OOO  [(0,0) (0,1) (1,1) (2,1)]
 *
 * "righty"
 *   O  [(2,0) (0,1) (1,1) (2,1)]
 * OOO
 *
 * "squarey"
 * OO   [(0,0) (1,0) (0,1) (1,1)]
 * OO
 *
 * "step up"
 *  OO  [(1,0) (2,0) (0,1) (1,1)]
 * OO
 *
 * "step down"
 * OO   [(0,0) (1,0) (1,1) (2,1)]
 *  OO
 *
 * "pyramid"
 *  O   [(1,0) (0,1) (1,1) (2,1)]
 * OOO
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

export const LINE      = new Shape([pos(0,0), pos(1,0), pos(2,0), pos(3,0)], "cyan");
export const LEFTY     = new Shape([pos(0,0), pos(0,1), pos(1,1), pos(2,1)], "blue");
export const RIGHTY    = new Shape([pos(2,0), pos(0,1), pos(1,1), pos(2,1)], "orange");
export const SQUAREY   = new Shape([pos(0,0), pos(1,0), pos(0,1), pos(1,1)], "yellow");
export const STEP_UP   = new Shape([pos(1,0), pos(2,0), pos(0,1), pos(1,1)], "green");
export const STEP_DOWN = new Shape([pos(0,0), pos(1,0), pos(1,1), pos(2,1)], "red");
export const PYRAMID   = new Shape([pos(1,0), pos(0,1), pos(1,1), pos(2,1)], "indigo");

const ALL_SHAPES = [LINE, LEFTY, RIGHTY, SQUAREY, STEP_UP, STEP_DOWN, PYRAMID];

export function pickRandomShape() {
    const index = getRandomInt(ALL_SHAPES.length);
    return ALL_SHAPES[index];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * A piece on the game board.
 */
export class Piece {
    constructor(shape, position) {
        this.shape = shape;
        this.position = position;
        this.color = shape.color;
    }

    occupies(position) {
        return this.occupiedPositions().some(occupied => occupied.equals(position));
    }

    occupiedPositions() {
        return this.shape.positions.map(position => position.add(this.position))
    }

    moveDown() {
        return new Piece(this.shape, this.position.plusY(1));
    }

    moveLeft() {
        return new Piece(this.shape, this.position.plusX(-1));
    }

    moveRight() {
        return new Piece(this.shape, this.position.plusX(1));
    }

    rotateClockwise() {
        return new Piece(this.shape.rotateClockwise(), this.position);
    }

    /**
     * Breaks this Piece into a list of its component Blocks.
     */
    decompose() {
        return this.occupiedPositions().map(position => new Block(this.color, position));
    }
}

/**
 * Once a piece lands and freezes, we decompose it into its component
 * Blocks. This allows us to remove a horizontal row, which may contain
 * fragments of multiple pieces.
 */
class Block {
    constructor(color, position) {
        this.color = color;
        this.position = position;
    }

    occupies(position) {
        return this.position.equals(position);
    }

    isInRow(rowNo) {
        return this.position.y === rowNo;
    }

    moveDown() {
        return new Block(this.color, this.position.plusY(1));
    }

    isAbove(rowNo) {
        return this.position.y < rowNo;
    }
}
