/*global require, describe, it */

require('chai').should();

import {
    shouldCreateActionWithCorrectPayload
} from '../lib/reduxMochaTestGenerators';

import {
    SOME_ACTION_NO_ARGS,
    SOME_ACTION_WITH_ARGS,
    someActionNoArgs,
    someActionWithArgs
} from './actions';

describe('actions', () => {
    // test payload on an action with no arguments
    shouldCreateActionWithCorrectPayload(
        describe, it, 
        true,
        someActionNoArgs, 
        SOME_ACTION_NO_ARGS);

    // test payload on an action with arguments
    shouldCreateActionWithCorrectPayload(
        describe, 
        it, 
        true,
        someActionWithArgs, 
        SOME_ACTION_WITH_ARGS, 
        ['1', '2'],
        {arg1: '1', arg2: '2'}
    );

    // test payload on an action with arguments with custom message
    shouldCreateActionWithCorrectPayload(
        describe, 
        it, 
        true,
        someActionWithArgs, 
        SOME_ACTION_WITH_ARGS, 
        ['1', '2'],
        {arg1: '1', arg2: '2'},
        'should work!!!!!1'
    );

});