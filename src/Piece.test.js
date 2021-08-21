import {LINE} from "./Shape";
import {Piece} from "./Piece";
import {pos} from "./Position";

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
