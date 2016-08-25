const should = require('chai').should();
import sinon from 'sinon';

const mockAssertions = {
    assertShouldDeepEqual: sinon.stub()
};

const proxyquire = require('proxyquire').noCallThru();
const {testActionCreatorReturnsCorrectPayload} = proxyquire('../src/reduxMochaTestGenerators',
    {
        './assertions': mockAssertions
    }
);

const fakeGlobal = {};

describe('testActionCreatorReturnsCorrectPayload', () => {
    beforeEach(() => {
        fakeGlobal.describe = (message, fn) => {
            fn();
        };

        fakeGlobal.it = (message, fn) => {
            fn();
        }
    });
    it('should throw an error if no describe is passed in', () => {
        (() => {
            testActionCreatorReturnsCorrectPayload();
        }).should.throw('describe is required');
    });
    it('should throw an error if no it is passed in', () => {
        (() => {
            testActionCreatorReturnsCorrectPayload(fakeGlobal.describe);
        }).should.throw('it is required');
    });
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
        const someActionCreator = () => {
            return {};
        };
        const someActionType = 'SOME_ACTION';

        const spy = sinon.spy(fakeGlobal, 'describe');
        
        testActionCreatorReturnsCorrectPayload(fakeGlobal.describe, fakeGlobal.it, someActionCreator, someActionType);

        spy.callCount.should.deep.equal(1);
        spy.args[0][0].should.deep.equal('someActionCreator');
    });

    it('should call \'it\' with default message if none passed in', () => {
        const someActionCreator = () => {
            return {};
        };
        const someActionType = 'SOME_ACTION';
        const message = 'should create an action with type SOME_ACTION';

        const spy = sinon.spy(fakeGlobal, 'it');
        
        testActionCreatorReturnsCorrectPayload(fakeGlobal.describe, fakeGlobal.it, someActionCreator, someActionType);

        spy.callCount.should.deep.equal(1);
        spy.args[0][0].should.deep.equal(message);
    });

    it('should call \'it\' with passed in message', () => {
        const someActionCreator = () => {
            return {};
        };
        const someActionType = 'SOME_ACTION';
        const message = 'should definitely create an action with type SOME_ACTION';

        const spy = sinon.spy(fakeGlobal, 'it');
        
        testActionCreatorReturnsCorrectPayload(fakeGlobal.describe, fakeGlobal.it, someActionCreator, someActionType, [], {}, message);

        spy.callCount.should.deep.equal(1);
        spy.args[0][0].should.deep.equal(message);
    });

    it('should call assertShouldDeepEqual with the correct result and expected action with no arguments or payload', () => {
        const someActionType = 'SOME_ACTION';
        const result = {
            type: someActionType
        };

        const expectedAction = {
            type: someActionType
        };

        const someActionCreator = () => {
            return result;
        };
        const message = 'should definitely create an action with type SOME_ACTION';

        const spy = sinon.spy(fakeGlobal, 'it');
        
        testActionCreatorReturnsCorrectPayload(fakeGlobal.describe, fakeGlobal.it, someActionCreator, someActionType, [], {}, message);

        mockAssertions.assertShouldDeepEqual.calledWithExactly(result, expectedAction);
    });

    it('should call assertShouldDeepEqual with the correct result and expected action with arguments and payload', () => {
        const args = [
            'someValue'
        ];

        const payload = {
            val: args[0]
        };

        const someActionType = 'SOME_ACTION';
        const result = {
            type: someActionType,
            val: args[0]
        };

        const expectedAction = {
            type: someActionType
        };

        const someActionCreator = () => {
            return result;
        };
        const message = 'should definitely create an action with type SOME_ACTION';

        const spy = sinon.spy(fakeGlobal, 'it');
        
        testActionCreatorReturnsCorrectPayload(fakeGlobal.describe, fakeGlobal.it, someActionCreator, someActionType, args, payload, message);

        mockAssertions.assertShouldDeepEqual.calledWithExactly(result, expectedAction);
    });
});