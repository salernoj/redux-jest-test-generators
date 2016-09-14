/*global require, describe, it */

require('chai').should();

import {
    actionCreator,
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
    actionCreator(someActionNoArgs)
        .wrapInDescribe(true)
        .shouldCreateAction({type: SOME_ACTION_NO_ARGS});

    // test payload on an action with arguments
    actionCreator(someActionWithArgs)
        .wrapInDescribe(true)
        .withArgs(['1', '2'])
        .shouldCreateAction({type: SOME_ACTION_WITH_ARGS, arg1: '1', arg2: '2'});

    // test payload on an action with arguments with custom message
    actionCreator(someActionWithArgs)
        .wrapInDescribe(true)
        .withArgs(['1', '2'])
        .shouldCreateAction({type: SOME_ACTION_WITH_ARGS, arg1: '1', arg2: '2'}, 'should work!!!!!1');
});