const should = require('chai').should();
import sinon from 'sinon';

import {
    reducerNullInitial,
    reducerUndefinedInitial,
    reducerEmptyArrayInitial
} from './reducers';

import {
    shouldHandleAction,
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