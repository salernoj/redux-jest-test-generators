const should = require('chai').should();

import {
    getArgumentsFromFunction
} from '../src/functionStringUtils';

const invalidFnTypes = [
    {name: 'Null', val: null},
    {name: 'Undefined', val: undefined},
    {name: 'Number', val: 1},
    {name: 'String', val: 'a'},
    {name: 'Object', val: {}},
    {name: 'Bool', val: false},
    {name: 'Array', val: []},
    {name: 'NaN', val: NaN},
    {name: 'empty string', val: ''}
];

describe('functionStringUtils', () => {
    describe('getArgumentsFromFunction', () => {
        invalidFnTypes.map(item => {
            it(`should throw an error if fn is a(n) ${item.name}`, () => {
                (() => {
                    getArgumentsFromFunction(item.val);
                }).should.throw('fn must be a function');
            });
        });

        it('should return an array of the arguments from an arrow function', () => {
            const fn = (a, b, c, d, e, f) => {};
            const expectedArgs = ['a', 'b', 'c', 'd', 'e', 'f'];

            const actualArgs = getArgumentsFromFunction(fn);

            actualArgs.should.deep.equal(expectedArgs);
        });
    });
});