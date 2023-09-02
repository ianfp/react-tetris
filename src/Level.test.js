import {getLevel, Level} from "./Level";

describe("Level", () => {
    describe("required score", () => {
        test.each([
            [0, 0],
            [1, 8],
            [2, 20],
        ])("index %i requires score of %i", (index, expectedScore) => {
            const level = new Level(index);
            expect(level.requiredScore).toEqual(expectedScore);
        });
    });

    describe("getLevel", () => {
        test.each([
            [0, 0],
            [7, 0],
            [8, 1], // +8 pts to index 1
            [19, 1],
            [20, 2], // +12 = 20 pts to index 2
            [37, 2],
            [38, 3], // + 18 = 38 pts to index 3
        ])("score of %i returns index %i", (currentScore, expectedIndex) => {
            const level = getLevel(currentScore);
            expect(level.index).toEqual(expectedIndex);
        });
    });

    describe("ticks", () => {
        test.each([
            [0, 10],
            [1, 9],
            [2, 8],
            [9, 1]
        ])("level index %i has ticks of %i", (index, expectedTicks) => {
            const level = new Level(index);
            expect(level.ticks).toEqual(expectedTicks);
        });
    })
});
