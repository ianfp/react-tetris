import {Block} from "./Block";

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
