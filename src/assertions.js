/*global expect */


/**
 * Wrapper for should.deep.equal from chai
 * @param {object} a - The object to compare
 * @param {object} b - The object to compare to
 */
export const assertShouldDeepEqual = (a, b) => {
    expect(a).toEqual(b);
};

/**
 * Wrapper for should.not.exist from chai
 * @param {object} a - The object to check
 */
export const assertShouldBeNull = a => {
    expect(a).toBeNull();
};

/**
 * Wrapper for should.not.exist from chai
 * @param {object} a - The object to check
 */
export const assertShouldBeUndefined = a => {
    expect(a).toBeUndefined();
};

/**
 * Wrapper for should.exist from chai
 * @param {object} a - The object to check
 */
export const assertShouldExist = a => {
    expect(a).toBeDefined();
};