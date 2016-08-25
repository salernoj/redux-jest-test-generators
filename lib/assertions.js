'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var should = require('chai').should();

/**
 * Wrapper for should.deep.equal from chai
 * @param {object} a - The object to compare
 * @param {object} b - The object to compare to
 */
var assertShouldDeepEqual = exports.assertShouldDeepEqual = function assertShouldDeepEqual(a, b) {
  a.should.deep.equal(b);
};