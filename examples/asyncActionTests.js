const should = require('chai').should();
import sinon from 'sinon';


import {
    shouldDispatchCorrectActionsWhenSuccessfulAsync
} from '../lib/reduxMochaTestGenerators';

const mockService = {
    testService: sinon.stub()
}

const proxyquire = require('proxyquire').noCallThru();
const {
    RECEIVE,
    RECEIVE_ERROR,
    REQUEST,
    callService
} = proxyquire('./asyncActions',
    {
        './services': mockService
    }
);

describe('asyncActions', () => {

    describe('callService', () => {
        const result = 'asdf';
        mockService.testService.returns(new Promise(resolve => resolve(result)));
        shouldDispatchCorrectActionsWhenSuccessfulAsync(
            describe, it,
            false,
            callService,
            [
                { type: REQUEST },
                { type: RECEIVE, result }
            ]);


    });
});