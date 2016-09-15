/*global require, describe, it */
require('chai').should();
import sinon from 'sinon';

import {
    asyncActionCreator,
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
        const successActions = [{ type: REQUEST },{ type: RECEIVE, result }];
        asyncActionCreator(callService)
            .wrapInDescribe(false)
            .success(true)
            .setUp(() => {
                mockService.testService.returns(new Promise(resolve => resolve(result)));
            })
            .shouldDispatchActions(successActions);
       
        const error = new Error('asdf');
        const failureActions = [{type: REQUEST},{type: RECEIVE_ERROR, error}];
        asyncActionCreator(callService)
            .wrapInDescribe(false)
            .success(false)
            .setUp(() => {
                mockService.testService.returns(new Promise((resolve, reject) => reject(error)));
            })
            .shouldDispatchActions(failureActions);
    });
    describe('callServiceWithArgs', () => {
        const resultWithArgs = 'asdf';
        const trueOrFalse = false;
        const successActionsWithArgs = [
            { type: REQUEST_WITH_ARGS },
            { type: RECEIVE_WITH_ARGS, resultWithArgs, trueOrFalse }
        ];
        asyncActionCreator(callServiceWithArgs)
            .setUp(() => {
                mockService.testService.returns(new Promise(resolve => resolve(resultWithArgs)));
            })
            .success(true)
            .withArgs([trueOrFalse])
            .shouldDispatchActions(successActionsWithArgs);
       
        const errorWithArgs = new Error('asdf');
        const failureActionsWithArgs = [ 
            {type: REQUEST_WITH_ARGS},
            {type: RECEIVE_ERROR_WITH_ARGS, errorWithArgs} 
        ];
        asyncActionCreator(callServiceWithArgs)
            .setUp(() => {
                mockService.testService.returns(new Promise((resolve, reject) => reject(errorWithArgs)));
            })
            .success(true)
            .withArgs([trueOrFalse])
            .shouldDispatchActions(failureActionsWithArgs);
    });
});
