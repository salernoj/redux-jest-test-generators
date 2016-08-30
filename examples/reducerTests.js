/*global require, describe, it */

require('chai').should();

import {
    reducerNullInitial,
    reducerUndefinedInitial,
    reducerEmptyArrayInitial
} from './reducers';

import {
    shouldReturnTheInitialState
} from '../lib/reduxMochaTestGenerators';

describe('reducers', () => {
    describe('reducerNullInitial', () => {
        shouldReturnTheInitialState(it, reducerNullInitial, null);
    });
    describe('reducerUndefinedInitial', () => {
        shouldReturnTheInitialState(it, reducerUndefinedInitial, undefined);
    });
    describe('reducerEmptyArrayInitial', () => {
        shouldReturnTheInitialState(it, reducerEmptyArrayInitial, []);
    });
});