const should = require('chai').should();
import sinon from 'sinon';

import {
    testActionCreatorReturnsCorrectPayload
} from '../src/reduxMochaTestGenerators';

const fakeGlobal = {};
fakeGlobal.describe = (message, fn) => {
    fn();
};

fakeGlobal.it = (message, fn) => {
    fn();
}

describe('testActionCreatorReturnsCorrectPayload', () => {
    it('should throw an error if no action is passed in', () => {
        (() => {
            testActionCreatorReturnsCorrectPayload(fakeGlobal.describe, fakeGlobal.it);
        }).should.throw('actionCreator is required');
    });

    it('should throw an error if no actionType is passed in', () => {
        const actionCreator = () => {};
        (() => {
            testActionCreatorReturnsCorrectPayload(fakeGlobal.describe, fakeGlobal.it, actionCreator);
        }).should.throw('actionType is required');
    });

    it('should call \'describe\' with the actionCreator name passed', () => {
        const someActionCreator = () => {};
        const someActionType = 'SOME_ACTION';

        const spy = sinon.spy(fakeGlobal, 'describe');
        
        testActionCreatorReturnsCorrectPayload(fakeGlobal.describe, fakeGlobal.it, someActionCreator, someActionType);

        spy.callCount.should.deep.equal(1);
        spy.args[0][0].should.deep.equal('someActionCreator');
    });

    it('should call \'it\' with default message if none passed in', () => {
        const someActionCreator = () => {};
        const someActionType = 'SOME_ACTION';
        const message = 'should create an action with type SOME_ACTION';

        const spy = sinon.spy(fakeGlobal, 'it');
        
        testActionCreatorReturnsCorrectPayload(fakeGlobal.describe, fakeGlobal.it, someActionCreator, someActionType);

        spy.callCount.should.deep.equal(1);
        spy.args[0][0].should.deep.equal(message);
    });
});