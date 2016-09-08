/*global require, describe, it */
require('chai').should();
import sinon from 'sinon';

import {
    shouldDispatchCorrectActions,
    shouldDispatchSuccessAndFailureActions
} from '../lib/reduxMochaTestGenerators';

const mockService = {
    testService: sinon.stub()
};

const proxyquire = require('proxyquire').noCallThru();
const {
    RECEIVE,
    RECEIVE_ERROR,
    REQUEST,
    RECEIVE_WITH_ARGS,
    RECEIVE_ERROR_WITH_ARGS,
    REQUEST_WITH_ARGS,
    callService,
    callServiceWithArgs,
} = proxyquire('./asyncActions',
    {
        './services': mockService
    }
);

describe('asyncActions', () => {

    describe('callService', () => {
        const result = 'asdf';
        const successActions = [
            { type: REQUEST },
            { type: RECEIVE, result }
        ];
        shouldDispatchCorrectActions(describe, it, callService, successActions, true, false)
            .run(() => {
                mockService.testService.returns(new Promise(resolve => resolve(result)));
            });
       
        const error = new Error('asdf');
        const failureActions = [ 
            {type: REQUEST},
            {type: RECEIVE_ERROR, error} 
        ];
        shouldDispatchCorrectActions(describe, it, callService, failureActions, false, false)
            .run(() => {
                mockService.testService.returns(new Promise((resolve, reject) => reject(error)));
            });
    });
    describe('callServiceWithArgs', () => {
        const resultWithArgs = 'asdf';
        const trueOrFalse = false;
        const successActionsWithArgs = [
            { type: REQUEST_WITH_ARGS },
            { type: RECEIVE_WITH_ARGS, resultWithArgs, trueOrFalse }
        ];
        shouldDispatchCorrectActions(describe, it, callServiceWithArgs, successActionsWithArgs, true, false)
            .run([trueOrFalse], () => {
                mockService.testService.returns(new Promise(resolve => resolve(resultWithArgs)));
            });
       
        const errorWithArgs = new Error('asdf');
        const failureActionsWithArgs = [ 
            {type: REQUEST_WITH_ARGS},
            {type: RECEIVE_ERROR_WITH_ARGS, errorWithArgs} 
        ];
        shouldDispatchCorrectActions(describe, it, callServiceWithArgs, failureActionsWithArgs, false, false)
            .run([trueOrFalse], () => {
                mockService.testService.returns(new Promise((resolve, reject) => reject(errorWithArgs)));
            });
    });

    describe('callServiceWithArgs using shouldDispatchSuccessAndFailureActions', () => {
        const resultWithArgs = 'asdf';
        const trueOrFalse = false;
        const successActionsWithArgs = [
            { type: REQUEST_WITH_ARGS },
            { type: RECEIVE_WITH_ARGS, resultWithArgs, trueOrFalse }
        ];
        const successSetUp = () => {
            mockService.testService.returns(new Promise(resolve => resolve(resultWithArgs)));
        };

        const errorWithArgs = new Error('asdf');
        const failureActionsWithArgs = [ 
            {type: REQUEST_WITH_ARGS},
            {type: RECEIVE_ERROR_WITH_ARGS, errorWithArgs} 
        ];
        const failureSetUp = () => {
            mockService.testService.returns(new Promise((resolve, reject) => reject(errorWithArgs)));
        };

        shouldDispatchSuccessAndFailureActions(describe, it, callServiceWithArgs)
            .run({
                expectedActions: successActionsWithArgs,
                args: [trueOrFalse],
                setUp: successSetUp 
            },
            {
                expectedActions: failureActionsWithArgs,
                args: [trueOrFalse],
                setUp: failureSetUp
            })
    });
});
