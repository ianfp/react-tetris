/* Array utility functions */

/**
 * Generate an array of the given length using the given function.
 */
export function arrayOf(length, mapFn) {
    return Array.from({length: length}, mapFn);
}
