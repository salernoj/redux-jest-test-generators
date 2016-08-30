const should = require('chai').should();

/**
 * Wrapper for should.deep.equal from chai
 * @param {object} a - The object to compare
 * @param {object} b - The object to compare to
 */
export const assertShouldDeepEqual = (a, b) => {
    a.should.deep.equal(b);
};

/**
 * Wrapper for should.not.exist from chai
 * @param {object} a - The object to check
 */
export const assertShouldNotExist = a => {
    should.not.exist(a);
}