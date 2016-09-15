const should = require('chai').should();
import sinon from 'sinon';

const mockAssertions = {
    assertShouldDeepEqual: sinon.stub(),
    assertShouldExist: sinon.stub(),
    assertShouldNotExist: sinon.stub()
};

const proxyquire = require('proxyquire').noCallThru();
const {
    actionCreator,
    asyncActionCreator,
    reducer,
    shouldCreateActionWithCorrectPayload,
    shouldDispatchCorrectActions,
    shouldDispatchSuccessAndFailureActions,
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

    describe('actionCreator', () => {
        const getDefaultActionCreator = () => {
            const args = [
                'someValue'
            ];

            const payload = {
                val: args[0]
            };

            const someActionType = 'SOME_ACTION';
            const someAction = {
                type: someActionType,
                val: args[0]
            };
            return (someActionCreator) => {
                return someAction;
            };
        };

        beforeEach(() => {
            fakeGlobal.describe = (message, fn) => {
                fn();
            };

            fakeGlobal.it = (message, fn) => {
                fn();
            }
        });

        it('should throw an error if no actionCreator is passed in', () => {
            (() => {
                actionCreator();
            }).should.throw('actionCreator is required');
        });

        it('should return an object with the correct properties with initial values', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = actionCreator(someActionCreator);

            result.should.have.property('actionCreator');
            result.actionCreator.should.deep.equal(someActionCreator);

            result.should.have.property('describe');
            result.describe.should.deep.equal(describe);

            result.should.have.property('it');
            result.it.should.deep.equal(it);

            result.should.have.property('shouldWrapInDescribe');
            result.shouldWrapInDescribe.should.be.false;

            result.should.have.property('args');
            result.args.should.deep.equal([]);
        });

        it('should return an object with the correct methods', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = actionCreator(someActionCreator);

            result.should.have.property('mochaMocks');
            result.should.have.property('wrapInDescribe');
            result.should.have.property('withArgs');
            result.should.have.property('shouldCreateAction');

        });

        it('should mock the describe and it methods when mochaMocks is called', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = actionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it);

            result.describe.should.deep.equal(fakeGlobal.describe);
            result.it.should.deep.equal(fakeGlobal.it);
        });

        it('should mock the describe and it methods when mochaMocks is called', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = actionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it);

            result.describe.should.deep.equal(fakeGlobal.describe);
            result.it.should.deep.equal(fakeGlobal.it);
        });

        it('should set shouldWrapInDescribe when wrapInDescribe is called', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = actionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .wrapInDescribe(true);

            result.shouldWrapInDescribe.should.be.true;
        });

        it('should set args when withArgs is called', () => {
            const args = [1, 2];
            const someActionCreator = getDefaultActionCreator();
            const result = actionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .wrapInDescribe(true)
                .withArgs(args);

            result.args.should.deep.equal(args);
        });

        it('should call \'describe\' if wrapInDescribe is called with true', () => {
            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };
            const someActionCreator = () => {
                return someAction;
            };
            const spy = sinon.spy(fakeGlobal, 'describe');

            const result = actionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .wrapInDescribe(true)
                .shouldCreateAction(someAction);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal('someActionCreator');
        });

        it('should not call \'describe\' if wrapInDescribe is called with false', () => {
            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };
            const someActionCreator = () => {
                return someAction;
            };
            const spy = sinon.spy(fakeGlobal, 'describe');

            const result = actionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .wrapInDescribe(false)
                .shouldCreateAction(someAction);

            spy.callCount.should.deep.equal(0);
        });

        it('should not call \'describe\'', () => {
            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };
            const someActionCreator = () => {
                return someAction;
            };
            const spy = sinon.spy(fakeGlobal, 'describe');

            const result = actionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldCreateAction(someAction);

            spy.callCount.should.deep.equal(0);
        });

        it('should call \'it\' with default message if none passed in', () => {
            const message = 'should create an action with type SOME_ACTION';

            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };
            const someActionCreator = () => {
                return someAction;
            };
            const spy = sinon.spy(fakeGlobal, 'it');

            const result = actionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldCreateAction(someAction);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });

        it('should call \'it\' with passed in message', () => {
            const message = 'should definitely create an action with type SOME_ACTION';

            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };
            const someActionCreator = () => {
                return someAction;
            };
            const spy = sinon.spy(fakeGlobal, 'it');

            const result = actionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldCreateAction(someAction, message);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });

        it('should call assertShouldDeepEqual with the correct result and expected action with no arguments', () => {
            const message = 'should definitely create an action with type SOME_ACTION';

            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };
            const someActionCreator = () => {
                return someAction;
            };

            const expectedAction = { type: someActionType };

            const spy = sinon.spy(fakeGlobal, 'it');

            const result = actionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldCreateAction(someAction, message);

            mockAssertions.assertShouldDeepEqual.calledWithExactly(someAction, expectedAction);
        });

        it('should call assertShouldDeepEqual with the correct result and expected action with arguments', () => {
            const message = 'should definitely create an action with type SOME_ACTION';

            const args = [1, 2];
            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };
            const someActionCreator = () => {
                return someAction;
            };

            const expectedAction = { type: someActionType };

            const spy = sinon.spy(fakeGlobal, 'it');

            const result = actionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .withArgs(args)
                .shouldCreateAction(someAction, message);

            mockAssertions.assertShouldDeepEqual.calledWithExactly(someAction, expectedAction);
        });

    });

    describe('asyncActionCreator', () => {
        const getDefaultActionCreator = () => {
            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            return () => {
                return dispatch => {
                    return asyncMethod();
                };
            };
        };

        beforeEach(() => {
            fakeGlobal.describe = (message, fn) => {
                fn();
            };

            fakeGlobal.it = (message, fn) => {
                fn();
            }
        });

        it('should throw an error if no asyncActionCreator is passed in', () => {
            (() => {
                asyncActionCreator();
            }).should.throw('asyncActionCreator is required');
        });

        it('should return an object with the correct properties with initial values', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator);

            result.should.have.property('asyncActionCreator');
            result.asyncActionCreator.should.deep.equal(someActionCreator);

            result.should.have.property('describe');
            result.describe.should.deep.equal(describe);

            result.should.have.property('it');
            result.it.should.deep.equal(it);

            result.should.have.property('shouldWrapInDescribe');
            result.shouldWrapInDescribe.should.be.false;

            result.should.have.property('args');
            result.args.should.deep.equal([]);
        });

        it('should return an object with the correct methods', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator);

            result.should.have.property('mochaMocks');
            result.should.have.property('wrapInDescribe');
            result.should.have.property('withArgs');
            result.should.have.property('shouldDispatchActions');

        });

        it('should mock the describe and it methods when mochaMocks is called', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it);

            result.describe.should.deep.equal(fakeGlobal.describe);
            result.it.should.deep.equal(fakeGlobal.it);
        });

        it('should mock the describe and it methods when mochaMocks is called', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it);

            result.describe.should.deep.equal(fakeGlobal.describe);
            result.it.should.deep.equal(fakeGlobal.it);
        });

        it('should set setUpFn when setUp is called', () => {
            const someFn = () => {};
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .setUp(someFn);

            result.setUpFn.should.deep.equal(someFn);
        });

        it('should set isSuccessful when success is called', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .success(false);

            result.isSuccessful.should.be.false;
        });

        it('should set shouldWrapInDescribe when wrapInDescribe is called', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .wrapInDescribe(true);

            result.shouldWrapInDescribe.should.be.true;
        });

        it('should set args when withArgs is called', () => {
            const args = [1, 2];
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .wrapInDescribe(true)
                .withArgs(args);

            result.args.should.deep.equal(args);
        });

        it('should call \'describe\' if wrapInDescribe is called with true', () => {
            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const spy = sinon.spy(fakeGlobal, 'describe');

            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .wrapInDescribe(true)
                .shouldDispatchActions([someAction]);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal('someActionCreator');
        });

        it('should not call \'describe\' if wrapInDescribe is called with false', () => {
            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const spy = sinon.spy(fakeGlobal, 'describe');

            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .wrapInDescribe(false)
                .shouldDispatchActions([someAction]);

            spy.callCount.should.deep.equal(0);
        });

        it('should not call \'describe\'', () => {
            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const spy = sinon.spy(fakeGlobal, 'describe');

            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldDispatchActions([someAction]);

            spy.callCount.should.deep.equal(0);
        });

        it('should call \'it\' with default message if none passed in', () => {
            const message = 'should create an action with type SOME_ACTION';

            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const spy = sinon.spy(fakeGlobal, 'it');

            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldDispatchActions([someAction], message);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });

        it('should call \'it\' with passed in message', () => {
            const message = 'should definitely create an action with type SOME_ACTION';

            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const spy = sinon.spy(fakeGlobal, 'it');

            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldDispatchActions([someAction], message);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });

        it('should call setUp function if set', () => {
            const message = 'should definitely create an action with type SOME_ACTION';

            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const setUp = sinon.stub();

            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .setUp(setUp)
                .shouldDispatchActions([someAction], message);

            setUp.callCount.should.deep.equal(1);
        });

        it('should call assertShouldDeepEqual with the correct result and expected action with no arguments', () => {
            const message = 'should definitely create an action with type SOME_ACTION';

            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const expectedAction = { type: someActionType };

            const spy = sinon.spy(fakeGlobal, 'it');

            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldDispatchActions([someAction], message);

            mockAssertions.assertShouldDeepEqual.calledWithExactly(someAction, expectedAction);
        });

        it('should call assertShouldDeepEqual with the correct result and expected action with arguments', () => {
            const message = 'should definitely create an action with type SOME_ACTION';

            const args = [1, 2];
            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const expectedAction = { type: someActionType };

            const spy = sinon.spy(fakeGlobal, 'it');

            const result = asyncActionCreator(someActionCreator)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .withArgs(args)
                .shouldDispatchActions([someAction], message);

            mockAssertions.assertShouldDeepEqual.calledWithExactly(someAction, expectedAction);
        });
    });

    describe('reducer', () => {
        beforeEach(() => {
            fakeGlobal.describe = (message, fn) => {
                fn();
            };

            fakeGlobal.it = (message, fn) => {
                fn();
            }
        });

        it('should throw an error if no reducer is passed in', () => {
            (() => {
                reducer();
            }).should.throw('reducer is required');
        });

        it('should return an object with the correct properties with initial values', () => {
            const expectedValue = 123;
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const result = reducer(testReducer);

            result.should.have.property('reducer');
            result.reducer.should.deep.equal(testReducer);

            result.should.have.property('it');
            result.it.should.deep.equal(it);
        });

        it('should return an object with the correct methods', () => {
            const expectedValue = 123;
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const result = reducer(testReducer);

            result.should.have.property('mochaMocks');
            result.should.have.property('shouldReturnTheInitialState');
            result.should.have.property('shouldHandleAction');

        });
    });
    describe('reducer.shouldReturnTheInitialState', () => {
        beforeEach(() => {
            fakeGlobal.it = (message, fn) => {
                fn();
            }
            mockAssertions.assertShouldDeepEqual = sinon.stub();
            mockAssertions.assertShouldNotExist = sinon.stub();
        });

        it('should call \'it\' with default message if none passed in', () => {
            const expectedValue = 123;
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const message = `should return the default state`;

            const spy = sinon.spy(fakeGlobal, 'it');

            reducer(testReducer)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldReturnTheInitialState(expectedValue);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });

        it('should call \'it\' with passed in message', () => {
            const expectedValue = 123;
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const message = 'should return the default state123';

            const spy = sinon.spy(fakeGlobal, 'it');

            reducer(testReducer)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldReturnTheInitialState(expectedValue, message);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });

        it('should call assertShouldDeepEqual on reducer\'s initial state and expectedValue', () => {
            const expectedValue = 123;
            const initialState = 321;
            const testReducer = (state = initialState, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const message = `should return the default state`;

            reducer(testReducer)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldReturnTheInitialState(expectedValue);

            mockAssertions.assertShouldDeepEqual.calledWithExactly(initialState, expectedValue).should.be.true;
        });
    });
    describe('reducer.shouldHandleAction', () => {
        beforeEach(() => {
            fakeGlobal.it = (message, fn) => {
                fn();
            }
            mockAssertions.assertShouldDeepEqual = sinon.stub();
            mockAssertions.assertShouldNotExist = sinon.stub();
        });

        it('should throw an error if no action is passed in', () => {
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            (() => {
                reducer(testReducer)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldHandleAction();
            }).should.throw('action is required');
        });

        it('should throw an error if no action doesn\'t have a type', () => {
            const action = 'SOME_ACTION';
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            (() => {
                reducer(testReducer)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldHandleAction(action);
            }).should.throw('an action must have a type');
        });

        it('should call \'it\' with default message if none passed in', () => {
            const action = { type: 'SOME_ACTION' };
            const expectedValue = 123;
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const message = `should handle ${action.type}`;

            const spy = sinon.spy(fakeGlobal, 'it');

            reducer(testReducer)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldHandleAction(action, expectedValue);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });
        it('should call \'it\' with passed in message', () => {
            const action = { type: 'SOME_ACTION' };
            const expectedValue = 123;
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const message = 'some message';

            const spy = sinon.spy(fakeGlobal, 'it');

            reducer(testReducer)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldHandleAction(action, expectedValue, undefined, message);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });

        it('should call assertShouldDeepEqual on reducer\'s value when handling the passed in action and expectedValue', () => {
            const expectedValue = 123;
            const action = { type: 'SOME_ACTION' };
            const initialState = 321;
            const newValue = 333;
            const testReducer = (state = initialState, action) => {
                switch (action.type) {
                    case 'SOME_ACTION':
                        return newValue;
                    default:
                        return state;
                };
            };

            const message = `should return the default state`;

            reducer(testReducer)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldHandleAction(action, expectedValue);

            mockAssertions.assertShouldDeepEqual.calledWithExactly(newValue, expectedValue).should.be.true;
        });
        it('should call assertShouldNotExist on reducer\'s value when handling the passed in action and expectedValue is null', () => {
            const expectedValue = null;
            const action = { type: 'SOME_ACTION' };
            const initialState = 321;
            const newValue = 333;
            const testReducer = (state = initialState, action) => {
                switch (action.type) {
                    case 'SOME_ACTION':
                        return newValue;
                    default:
                        return state;
                };
            };

            const message = `should return the default state`;

            reducer(testReducer)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldHandleAction(action, expectedValue);

            mockAssertions.assertShouldNotExist.calledWithExactly(newValue).should.be.true;
        });
        it('should call assertShouldNotExist on reducer\'s value when handling the passed in action and expectedValue is undefined', () => {
            const expectedValue = undefined;
            const action = { type: 'SOME_ACTION' };
            const initialState = 321;
            const newValue = 333;
            const testReducer = (state = initialState, action) => {
                switch (action.type) {
                    case 'SOME_ACTION':
                        return newValue;
                    default:
                        return state;
                };
            };

            const message = `should return the default state`;

            reducer(testReducer)
                .mochaMocks(fakeGlobal.describe, fakeGlobal.it)
                .shouldHandleAction(action, expectedValue);

            mockAssertions.assertShouldNotExist.calledWithExactly(newValue).should.be.true;
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

            mockAssertions.assertShouldDeepEqual = sinon.stub();
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

            shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it, someAsyncActionCreator, {}, true, true)
                .run();

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

            shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it, someAsyncActionCreator, {}, true, false)
                .run();

            spy.callCount.should.deep.equal(0);
        });

        it('should call \'it\' with default message if none passed in when success is true', () => {
            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someAsyncActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const message = 'should create the appropriate actions when async call successful';

            const spy = sinon.spy(fakeGlobal, 'it');

            shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it, someAsyncActionCreator, {}, true, false)
                .run();

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });

        it('should call \'it\' with default message if none passed in when success is false', () => {
            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someAsyncActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const message = 'should create the appropriate actions when async call unsuccessful';

            const spy = sinon.spy(fakeGlobal, 'it');

            shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it, someAsyncActionCreator, {}, false, true)
                .run();

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });

        it('should call \'it\' with passed in message', () => {
            const setUpMocks = () => { };
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

            shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it, someAsyncActionCreator, {}, true, true, message)
                .run();

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

            shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it, someAsyncActionCreator, {}, true, true, message)
                .run([], setUpMocks);

            setUpMocks.callCount.should.deep.equal(1);
        });

        it('should call setUpMocks if passed in as first argument', () => {
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

            shouldDispatchCorrectActions(fakeGlobal.describe, fakeGlobal.it, someAsyncActionCreator, {}, true, true, message)
                .run(setUpMocks);

            setUpMocks.callCount.should.deep.equal(1);
        });
    });

    describe('shouldDispatchSuccessAndFailureActions', () => {
        beforeEach(() => {
            fakeGlobal.describe = (message, fn) => {
                fn();
            };

            fakeGlobal.it = (message, fn) => {
                fn();
            }

            mockAssertions.assertShouldDeepEqual = sinon.stub();
        });

        it('should throw an error if no describe is passed in', () => {
            (() => {
                shouldDispatchSuccessAndFailureActions();
            }).should.throw('describe is required');
        });

        it('should throw an error if no it is passed in', () => {
            (() => {
                shouldDispatchSuccessAndFailureActions(fakeGlobal.describe);
            }).should.throw('it is required');
        });

        it('should throw an error if no asyncActionCreator is passed in', () => {
            (() => {
                shouldDispatchSuccessAndFailureActions(fakeGlobal.describe, fakeGlobal.it);
            }).should.throw('asyncActionCreator is required');
        });

        it('should return an object with a method called run', () => {
            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someAsyncActionCreator = () => {
                return dispatch => {
                    return asyncMethod();
                };
            };

            const result = shouldDispatchSuccessAndFailureActions(fakeGlobal.describe, fakeGlobal.it, someAsyncActionCreator);
            result.run({}, {});

            should.exist(result);
            result.run.should.be.function;

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
            const action = { type: 'SOME_ACTION' };
            const expectedValue = 123;
            const reducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const message = `should handle ${action.type}`;

            const spy = sinon.spy(fakeGlobal, 'it');

            shouldHandleAction(fakeGlobal.it, reducer, action, expectedValue);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });
        it('should call \'it\' with passed in message', () => {
            const action = { type: 'SOME_ACTION' };
            const expectedValue = 123;
            const reducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                };
            };

            const message = 'some message';

            const spy = sinon.spy(fakeGlobal, 'it');

            shouldHandleAction(fakeGlobal.it, reducer, action, expectedValue, undefined, message);

            spy.callCount.should.deep.equal(1);
            spy.args[0][0].should.deep.equal(message);
        });
        it('should call assertShouldDeepEqual on reducer\'s value when handling the passed in action and expectedValue', () => {
            const expectedValue = 123;
            const action = { type: 'SOME_ACTION' };
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
            const action = { type: 'SOME_ACTION' };
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
            const action = { type: 'SOME_ACTION' };
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
            const action = { type: 'SOME_ACTION' };
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
            const action = { type: 'SOME_ACTION' };
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