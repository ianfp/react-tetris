import {pos} from "./Position";
import {LINE} from "./Shape";

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
