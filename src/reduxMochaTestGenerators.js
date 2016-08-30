import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

import {
    assertShouldDeepEqual,
    assertShouldNotExist
} from './assertions';

/**
 * Test that an action creator returns the correct payload
 * @param {function} describe - mocha describe function
 * @param {function} it - mocha it describe function
 * @param {bool} shouldWrapInDescribe - should the method create a describe wrapper
 * @param {function} actionCreator - the action creator to test
 * @param {string} actionType - the string type of the action
 * @param {array} actionCreatorArgs - the args that will be passed into the actionCreator
 * @param {object} payload - an object containing the non-type properties the actionCreator should returns
 * @param {string} message - the message for the assertion 
 */
export const shouldCreateActionWithCorrectPayload = (describe, it, shouldWrapInDescribe, actionCreator, actionType, actionCreatorArgs, payload, message) => {
    if (!describe) {
        throw new Error('describe is required');
    }

    if (!it) {
        throw new Error('it is required');
    }

    if (!actionCreator) {
        throw new Error('actionCreator is required');
    }

    if (!actionType) {
        throw new Error('actionType is required');
    }

    const shouldMessage = message ? message : `should create an action with type ${actionType}`;

    wrapInDescribeBlock(describe, it, shouldWrapInDescribe, actionCreator.name, shouldMessage,
        () => {
            const expectedAction = {
                type: actionType,
                ...payload
            };

            const result = actionCreator.apply(this, actionCreatorArgs);

            assertShouldDeepEqual(result, expectedAction);
        }
    );
};

/**
 * Test that an async action creator calls the correct actions.  The async method should be mocked 
 * and should return a Promise.
 * @param {function} describe - mocha describe function
 * @param {function} it - mocha it describe function
 * @param {bool} shouldWrapInDescribe - should the method create a describe wrapper
 * @param {function} asyncActionCreator - the action creator to test
 * @param {function} asyncMethod - the async method that the action calls
 * @param {object} expectedActions - the actions expected to be called
 * @param {string} message - the message for the assertion 
 */
export const shouldDispatchCorrectActions = (describe, it, shouldWrapInDescribe, asyncActionCreator, expectedActions, setUpMocks, message) => {
    if (!describe) {
        throw new Error('describe is required');
    }

    if (!it) {
        throw new Error('it is required');
    }

    if (!asyncActionCreator) {
        throw new Error('asyncActionCreator is required');
    }

    const shouldMessage = message ? message : 'should create the appropriate actions when successful';

    wrapInDescribeBlock(describe, it, shouldWrapInDescribe, asyncActionCreator.name, shouldMessage, 
        () => {
            if (setUpMocks) {
                setUpMocks();
            }

            const store = mockStore();

            return store.dispatch(asyncActionCreator())
                .then(() => {
                    assertShouldDeepEqual(store.getActions(), expectedActions);
                });
        });
};

/**
 * Test that a reducer returns the correct initial state
 * @param {function} it - mocha it describe function
 * @param {function} reducer - the reducer to test
 * @param {object} expectedInitialValue - the value the reducer should initially return
 */
export const shouldReturnTheInitialState = (it, reducer, expectedInitialValue) => {
    if (!it) {
        throw new Error('it is required');
    }

    if (!reducer) {
        throw new Error('reducer is required');
    }

    const message = 'should return the default state';
    

    wrapInItBlock(it, message, () => {
        const state = reducer(undefined, {});
        if (expectedInitialValue === null || expectedInitialValue === undefined) {
            assertShouldNotExist(state);
        } else {
            assertShouldDeepEqual(state, expectedInitialValue);
        }
        
    });
};

/**
 * Test that the reducer handles the action correctly by returning the expectedValue
 * @param {function} it - mocha it describe function
 * @param {function} reducer - the reducer to test
 * @param {object} action - the action the reducer will handle
 * @param {object} expectedValue - the value to expect when the action to return
 */
export const shouldHandleAction = (it, reducer, action, expectedValue) => {
    if (!it) {
        throw new Error('it is required');
    }

    if (!reducer) {
        throw new Error('reducer is required');
    }

    if (!action) {
        throw new Error('action is required');
    }

    if (!action.type) {
        throw new Error('an action must have a type');
    }

    const message = `should handle ${action.name}`;

    wrapInItBlock(it, message, () => {
        const state = reducer(undefined, action);

        if (expectedValue === null || expectedValue === undefined) {
            assertShouldNotExist(state);
        } else {
            assertShouldDeepEqual(state, expectedValue);
        }
    });
};

/**
 * Wrap a test in describe block
 * @param {function} describe - mocha describe function
 * @param {function} it - mocha it describe function
 * @param {bool} shouldWrap - should wrap in describe block
 * @param {string} describeMessage - the message for the describe block
 * @param {string} itMessage - the message for the it block
 * @param {function} itCallback - the callback for the it
 */
const wrapInDescribeBlock = (describe, it, shouldWrap, describeMessage, itMessage, itCallback) => {
    if (shouldWrap) {
        describe(describeMessage, () => {
            wrapInItBlock(it, itMessage, itCallback);
        });
    } else {
        wrapInItBlock(it, itMessage, itCallback);
    }
};

/**
 * Wrap a test in an it block
 * @param {function} describe - mocha describe function
 * @param {function} it - mocha it describe function
 * @param {string} message - the message for the it block
 * @param {function} callback - the callback for the it
 */
const wrapInItBlock = (it, message, callback) => {
    it(message, callback);
};