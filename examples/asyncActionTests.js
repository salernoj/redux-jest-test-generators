const should = require('chai').should();

import {
    testAsyncActionCreatorSuccessDispatchesCorrectActions
} from '../lib/reduxMochaTestGenerators';

const result = 'asdf';

const mockService = {
    testService: () => {
        return new Promise(resolve => resolve(result));
    }
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
    testAsyncActionCreatorSuccessDispatchesCorrectActions(
        describe, it, 
        callService, 
        [ 
            {type: REQUEST},
            {type: RECEIVE, result} 
        ]);
});