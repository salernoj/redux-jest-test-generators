/*global require, describe, it */

require('chai').should();

import {
    SOME_ACTION_NO_ARGS,
    SOME_ACTION_WITH_ARGS
} from './actions';

import {
    reducerNullInitial,
    reducerUndefinedInitial,
    reducerEmptyArrayInitial
} from './reducers';

import {
    reducer,
    shouldReturnTheInitialState
} from '../lib/reduxMochaTestGenerators';

describe('reducers', () => {
    describe('reducerNullInitial', () => {
        reducer(reducerNullInitial)
            .shouldReturnTheInitialState(null)
            .shouldHandleAction({type: SOME_ACTION_NO_ARGS}, 1)
            .shouldHandleAction({type: SOME_ACTION_WITH_ARGS, arg1: 2}, 2, 1, 'should be 2!!!!');
    });
    describe('reducerUndefinedInitial', () => {
        reducer(reducerUndefinedInitial)
            .shouldReturnTheInitialState(undefined);
    });
    describe('reducerEmptyArrayInitial', () => {
        reducer(reducerEmptyArrayInitial)
            .shouldReturnTheInitialState([], 'should return an empty array');
    });
});