const should = require('chai').should();

import {
    testActionCreatorReturnsCorrectPayload
} from '../lib/reduxMochaTestGenerators';

import {
    SOME_ACTION_NO_ARGS,
    SOME_ACTION_WITH_ARGS,
    someActionNoArgs,
    someActionWithArgs
} from './actions';

describe('actions', () => {
    // test payload on an action with no arguments
    testActionCreatorReturnsCorrectPayload(describe, it, someActionNoArgs, SOME_ACTION_NO_ARGS);

    // test payload on an action with arguments
    testActionCreatorReturnsCorrectPayload(
        describe, 
        it, 
        someActionWithArgs, 
        SOME_ACTION_WITH_ARGS, 
        ['1', '2'],
        {arg1: '1', arg2: '2'}
    );

    // test payload on an action with arguments with custom message
    testActionCreatorReturnsCorrectPayload(
        describe, 
        it, 
        someActionWithArgs, 
        SOME_ACTION_WITH_ARGS, 
        ['1', '2'],
        {arg1: '1', arg2: '2'},
        'should work!!!!!1'
    );

});