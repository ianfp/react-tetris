/**
 * Once a piece lands and freezes, we decompose it into its component
 * Blocks. This allows us to remove a horizontal row, which may contain
 * fragments of multiple pieces.
 */
export class Block {
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
