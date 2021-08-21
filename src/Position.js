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
