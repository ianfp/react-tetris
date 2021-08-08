import {LINE, Piece, pos} from "./Model";

describe("Position", () => {
    const original = pos(4, 5);

    describe("add", () => {
        it("works with origin", () => {
            const result = original.add(pos(0, 0));
            expect(result.x).toEqual(4);
            expect(result.y).toEqual(5);
        });

        it("works with positive numbers", () => {
            const result = original.add(pos(3, 11));
            expect(result.x).toEqual(7);
            expect(result.y).toEqual(16);
        });

        it("works with negative numbers", () => {
            const result = original.add(pos(-3, -8));
            expect(result.x).toEqual(1);
            expect(result.y).toEqual(-3);
        });
    });

    describe("equals", () => {
        it("returns true when equal", () => {
            expect(original.equals(pos(4, 5))).toBeTruthy();
        });

        it("returns false when not equal", () => {
            expect(original.equals(pos(5, 5))).toBeFalsy();
            expect(original.equals(pos(4, 4))).toBeFalsy();
        });
    });

    describe("rotateClockwise", () => {
        it("origin stays", () => {
            expect(pos(0, 0).rotateClockwise().equals(pos(0, 0))).toBeTruthy();
        });
        it("first quadrant", () => {
            expect(pos(2, 1).rotateClockwise().equals(pos(-1, 2))).toBeTruthy();
        });
    });
});

describe("Shape", () => {
    describe("rotateClockwise", () => {
        it("rotates a line", () => {
            const result = LINE.rotateClockwise();
            [pos(0, -1), pos(0, 0), pos(0, 1), pos(0, 2)].forEach(expected => {
                expect(result.positions.some(p => p.equals(expected))).toBeTruthy();
            });
        });
    });
});

describe("Piece", () => {
    describe("occupies", () => {
        const piece = new Piece(LINE, pos(3, 3));
        [pos(2, 3), pos(3, 3), pos(4, 3), pos(5, 3)].forEach(expected => {
            it(`is true for ${expected}`, () => {
                expect(piece.occupies(expected)).toBeTruthy();
            });
        });

        [pos(1, 3), pos(3, 4), pos(3, 2), pos(6, 3)].forEach(notExpected => {
            it(`is false for ${notExpected}`, () => {
                expect(piece.occupies(notExpected)).toBeFalsy();
            });
        });
    });

    describe("rotateClockwise", () => {
        it("rotates around the shape origin", () => {
            const piece = new Piece(LINE, pos(2, 4));
            const rotated = piece.rotateClockwise();
            [pos(2, 3), pos(2, 4), pos(2, 5), pos(2, 6)].forEach(expected => {
                expect(rotated.occupies(expected)).toBeTruthy();
            });
        });
    });

    describe("decompose", () => {
        it("breaks into its component Blocks", () => {
            const piece = new Piece(LINE, pos(3, 3));
            const blocks = piece.decompose();
            expect(blocks.length).toEqual(4);
            [pos(2, 3), pos(3, 3), pos(4, 3), pos(5, 3)].forEach(position => {
                expect(blocks.filter(block => block.occupies(position)).length).toEqual(1);
            });
        });
    });
});
