const should = require('chai').should();
import sinon from 'sinon';

const mockAssertions = {
    assertShouldDeepEqual: sinon.stub(),
    assertShouldExist: sinon.stub(),
    assertShouldNotExist: sinon.stub()
};

const proxyquire = require('proxyquire').noCallThru();
const {
    shouldCreateActionWithCorrectPayload,
    shouldDispatchCorrectActions,
    shouldHandleAction,
    shouldReturnTheInitialState
} = proxyquire('../src/reduxMochaTestGenerators',
    {
        './assertions': mockAssertions
    }
);

const fakeGlobal = {};

describe('reduxMochaTestGenerators', () => {
    describe('shouldCreateActionWithCorrectPayload', () => {
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
                shouldCreateActionWithCorrectPayload();
            }).should.throw('describe is required');
        });
        it('should throw an error if no it is passed in', () => {
            (() => {
                shouldCreateActionWithCorrectPayload(fakeGlobal.describe);
            }).should.throw('it is required');
        });
        it('should throw an error if no action is passed in', () => {
            (() => {
                shouldCreateActionWithCorrectPayload(fakeGlobal.describe, fakeGlobal.it, true);
            }).should.throw('actionCreator is required');
        });

        it('should throw an error if no actionType is passed in', () => {
            const actionCreator = () => { };
            (() => {
                shouldCreateActionWithCorrectPayload(fakeGlobal.describe, fakeGlobal.it, true, actionCreator);
            }).should.throw('actionType is required');
        });

        it('should call \'describe\' with the actionCreator name passed if shouldWrapInDescribe is true', () => {
            const someActionCreator = () => {
                return {};
            };
            const someActionType = 'SOME_ACTION';

            const spy = sinon.spy(fakeGlobal, 'describe');

            shouldCreateActionWithCorrectPayload(fakeGlobal.describe, fakeGlobal.it, true, someActionCreator, someActionType);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal('someActionCreator');
        });

        it('should not call \'describe\' with the actionCreator name passed if shouldWrapInDescribe is false', () => {
            const someActionCreator = () => {
                return {};
            };
            const someActionType = 'SOME_ACTION';

            const spy = sinon.spy(fakeGlobal, 'describe');

            shouldCreateActionWithCorrectPayload(fakeGlobal.describe, fakeGlobal.it, false, someActionCreator, someActionType);

            spy.callCount.should.deep.equal(0);
        });

        it('should call \'it\' with default message if none passed in', () => {
            const someActionCreator = () => {
                return {};
            };
            const someActionType = 'SOME_ACTION';
            const message = 'should create an action with type SOME_ACTION';

            const spy = sinon.spy(fakeGlobal, 'it');

            shouldCreateActionWithCorrectPayload(fakeGlobal.describe, fakeGlobal.it, true, someActionCreator, someActionType);

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

            shouldCreateActionWithCorrectPayload(fakeGlobal.describe, fakeGlobal.it, true, someActionCreator, someActionType, [], {}, message);

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

            shouldCreateActionWithCorrectPayload(fakeGlobal.describe, fakeGlobal.it, true, someActionCreator, someActionType, [], {}, message);

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

            shouldCreateActionWithCorrectPayload(fakeGlobal.describe, fakeGlobal.it, true, someActionCreator, someActionType, args, payload, message);

            mockAssertions.assertShouldDeepEqual.calledWithExactly(result, expectedAction);
        });
    });

    describe('shouldDispatchCorrectActions', () => {
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
                shouldDispatchCorrectActions();
            }).should.throw('describe is required');
        });
        it('should throw an error if no it is passed in', () => {
            (() => {
                shouldDispatchCorrectActions(fakeGlobal.describe);
            }).should.throw('it is required');
        });
        it('should throw an error if no asyncActionCreator is passed in', () => {
            (() => {
                shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it);
            }).should.throw('asyncActionCreator is required');
        });

        it('should call \'describe\' with the actionCreator name passed and shouldWrapInDescribe is true', () => {
            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someAsyncActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const spy = sinon.spy(fakeGlobal, 'describe');

            shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it, true, someAsyncActionCreator);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal('someAsyncActionCreator');
        });

        it('should not call \'describe\' with the actionCreator name passed and shouldWrapInDescribe is false', () => {
            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someAsyncActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const spy = sinon.spy(fakeGlobal, 'describe');

            shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it, false, someAsyncActionCreator);

            spy.callCount.should.deep.equal(0);
        });

        it('should call \'it\' with default message if none passed in', () => {
            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someAsyncActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const message = 'should create the appropriate actions when successful';

            const spy = sinon.spy(fakeGlobal, 'it');

            shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it, true, someAsyncActionCreator);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });

        it('should call \'it\' with passed in message', () => {
            const setUpMocks = () => {};
            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someAsyncActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const message = 'some message';

            const spy = sinon.spy(fakeGlobal, 'it');

            shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it, true, someAsyncActionCreator, {}, setUpMocks, message);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });

        it('should call setUpMocks if passed in', () => {
            const setUpMocks = sinon.stub();
            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someAsyncActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const message = 'some message';

            shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it, true, someAsyncActionCreator, {}, setUpMocks, message);

            setUpMocks.callCount.should.deep.equal(1);
        });
    });

    describe('shouldHandleAction', () => {
        beforeEach(() => {
            fakeGlobal.it = (message, fn) => {
                fn();
            }
            mockAssertions.assertShouldDeepEqual = sinon.stub();
            mockAssertions.assertShouldNotExist = sinon.stub();
        });
        it('should throw an error if no it is passed in', () => {
            (() => {
                shouldHandleAction();
            }).should.throw('it is required');
        });
        it('should throw an error if no reducer is passed in', () => {
            (() => {
                shouldHandleAction(fakeGlobal.it);
            }).should.throw('reducer is required');
        });
        it('should throw an error if no action is passed in', () => {
            const reducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            (() => {
                shouldHandleAction(fakeGlobal.it, reducer);
            }).should.throw('action is required');
        });
        it('should throw an error if action does not have a type', () => {
            const action = 'SOME_ACTION';            
            const reducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };
            
            (() => {
                shouldHandleAction(fakeGlobal.it, reducer, action);
            }).should.throw('action must have a type');
        });
        it('should call \'it\' with default message if none passed in', () => {
            const action = {type: 'SOME_ACTION'};
            const expectedValue = 123;
            const reducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const message = `should handle ${action.type.name}`;

            const spy = sinon.spy(fakeGlobal, 'it');

            shouldHandleAction(fakeGlobal.it, reducer, action, expectedValue);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });
        it('should call assertShouldDeepEqual on reducer\'s value when handling the passed in action and expectedValue', () => {
            const expectedValue = 123;
            const action = {type: 'SOME_ACTION'};
            const initialState = 321;
            const newValue = 333;
            const reducer = (state = initialState, action) => {
                switch (action.type) {
                    case 'SOME_ACTION':
                        return newValue;
                    default:
                        return state;
                };
            };

            const message = `should return the default state`;

            shouldHandleAction(fakeGlobal.it, reducer, action, expectedValue);

            mockAssertions.assertShouldDeepEqual.calledWithExactly(newValue, expectedValue).should.be.true;
        });
        it('should call assertShouldNotExist on reducer\'s value when handling the passed in action and expectedValue is null', () => {
            const expectedValue = null;
            const action = {type: 'SOME_ACTION'};
            const initialState = 321;
            const newValue = 333;
            const reducer = (state = initialState, action) => {
                switch (action.type) {
                    case 'SOME_ACTION':
                        return newValue;
                    default:
                        return state;
                };
            };

            const message = `should return the default state`;

            shouldHandleAction(fakeGlobal.it, reducer, action, expectedValue);

            mockAssertions.assertShouldNotExist.calledWithExactly(newValue).should.be.true;
        });
        it('should call assertShouldNotExist on reducer\'s value when handling the passed in action and expectedValue is undefined', () => {
            const expectedValue = undefined;
            const action = {type: 'SOME_ACTION'};
            const initialState = 321;
            const newValue = 333;
            const reducer = (state = initialState, action) => {
                switch (action.type) {
                    case 'SOME_ACTION':
                        return newValue;
                    default:
                        return state;
                };
            };

            const message = `should return the default state`;

            shouldHandleAction(fakeGlobal.it, reducer, action, expectedValue);

            mockAssertions.assertShouldNotExist.calledWithExactly(newValue).should.be.true;
        });
    });

    describe('shouldReturnTheInitialState', () => {
        beforeEach(() => {
            fakeGlobal.it = (message, fn) => {
                fn();
            }
            mockAssertions.assertShouldDeepEqual = sinon.stub();
        });
        it('should throw an error if no it is passed in', () => {
            (() => {
                shouldReturnTheInitialState();
            }).should.throw('it is required');
        });
        it('should throw an error if no reducer is passed in', () => {
            (() => {
                shouldReturnTheInitialState(fakeGlobal.it);
            }).should.throw('reducer is required');
        });
        it('should call \'it\' with default message if none passed in', () => {
            const expectedValue = 123;
            const reducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const message = `should return the default state`;

            const spy = sinon.spy(fakeGlobal, 'it');

            shouldReturnTheInitialState(fakeGlobal.it, reducer, expectedValue);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });
        it('should call assertShouldDeepEqual on reducer\'s initial state and expectedValue', () => {
            const expectedValue = 123;
            const initialState = 321;
            const reducer = (state = initialState, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const message = `should return the default state`;

            shouldReturnTheInitialState(fakeGlobal.it, reducer, expectedValue);

            mockAssertions.assertShouldDeepEqual.calledWithExactly(initialState, expectedValue).should.be.true;
        });

        it('should call assertShouldNotExist on reducer\'s value when expectedInitialValue is null', () => {
            const expectedInitialValue = null;
            const action = {type: 'SOME_ACTION'};
            const initialState = null;
            const reducer = (state = initialState, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const message = `should return the default state`;

            shouldReturnTheInitialState(fakeGlobal.it, reducer, expectedInitialValue);

            mockAssertions.assertShouldNotExist.calledWithExactly(initialState).should.be.true;
        });
        it('should call assertShouldNotExist on reducer\'s value when expectedInitialValue is undefined', () => {
            const expectedInitialValue = undefined;
            const action = {type: 'SOME_ACTION'};
            const initialState = undefined;
            const reducer = (state = initialState, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const message = `should return the default state`;

            shouldReturnTheInitialState(fakeGlobal.it, reducer, expectedInitialValue);

            mockAssertions.assertShouldNotExist.calledWithExactly(initialState).should.be.true;
        });
    });
});