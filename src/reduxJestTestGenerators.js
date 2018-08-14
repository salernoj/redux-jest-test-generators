/*global describe, it */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

import {
    assertShouldDeepEqual,
    assertShouldExist,
    assertShouldNotExist
} from './assertions';

/**
 * Test an asyncActionCreator
 * @param {function} asyncActionCreator - async action creator
 * @return {object} - the start of the test chain
 */
export const asyncActionCreator = asyncActionCreator => {
    const self = {
        asyncActionCreator,
        describe,
        it,
        shouldWrapInDescribe: false,
        args: [],
        setUpFn: null,
        isSuccessful: true
    };

    if (!asyncActionCreator) {
        throw new Error('asyncActionCreator is required');
    }

    self.mochaMocks = mochaMocks;
    self.wrapInDescribe = wrapInDescribe;
    self.withArgs = withArgs;

    self.setUp = setUp => {
        self.setUpFn = setUp;
        return self;
    };

    self.success = isSuccessful => {
        self.isSuccessful = isSuccessful;
        return self;
    };

    self.shouldDispatchActions = (expectedActions, message) => {
        const successText = self.isSuccessful ? 'successful' : 'unsuccessful';
        const shouldMessage = message ? message : `should dispatch the appropriate actions when async call ${successText}`;

        wrapInDescribeBlock(self.describe, self.it, self.shouldWrapInDescribe, self.asyncActionCreator.name, shouldMessage,
            () => {
                if (self.setUpFn && typeof (self.setUpFn) === 'function') {
                    self.setUpFn();
                }

                const store = mockStore();
                return store.dispatch(self.asyncActionCreator.apply(this, self.args))
                    .then(() => {
                        assertShouldDeepEqual(store.getActions(), expectedActions);
                    })
                    .catch(() => {
                        assertShouldDeepEqual(store.getActions(), expectedActions);
                    });
            });
    };

    return self;
};

/**
 * Test an action creator
 * @param {function} actionCreator - the action creator to test
 * @return {object} - the start of the test chain
 */
export const actionCreator = actionCreator => {
    const self = {
        actionCreator,
        describe,
        it,
        shouldWrapInDescribe: false,
        args: []
    };

    if (!actionCreator) {
        throw new Error('actionCreator is required');
    }

    self.mochaMocks = mochaMocks;
    self.wrapInDescribe = wrapInDescribe;
    self.withArgs = withArgs;

    self.shouldCreateAction = (expectedAction, message) => {
        const shouldMessage = message ? message : `should create an action with type ${expectedAction.type}`;

        wrapInDescribeBlock(self.describe, self.it, self.shouldWrapInDescribe, self.actionCreator.name, shouldMessage,
            () => {
                const result = actionCreator.apply(this, self.args);
                assertShouldDeepEqual(result, expectedAction);
            }
        );
    };

    return self;
};

/**
 * 
 */
export const reducer = reducer => {
    const self = {
        reducer,
        it
    };

    if (!reducer) {
        throw new Error('reducer is required');
    }

    self.mochaMocks = mochaMocks;

    /** 
     * Test whether or not the reducer's initial state equals the expected value passed in
     * @param {object} expectedValue - The value expected for the initial state
     * @param {string} [message] - optional message for the test 
     */
    self.shouldReturnTheInitialState = (expectedValue, message = undefined) => {
        const shouldMessage = message ? message : 'should return the default state';

        wrapInItBlock(self.it, shouldMessage, () => {
            const state = self.reducer(undefined, {});
            compareExpectedToState(expectedValue, state);
        });

        return self;
    };

    /**
     * Test whether or not the reducer handles an action appropriately
     * @param {object} action - the action to test
     * @param {string} action.type - the string type of the action
     * @param {object} [initialValue] - optional initial value for the reducer
     * @param {string} [message] - optional message for the test to return
     */
    self.shouldHandleAction = (action, expectedValue, initialValue = undefined, message = undefined) => {
        if (!action) {
            throw new Error('action is required');
        }

        if (!action.type) {
            throw new Error('an action must have a type');
        }

        const itMessage = message ? message : `should handle ${action.type}`;

        wrapInItBlock(self.it, itMessage, () => {
            const state = self.reducer(initialValue, action);

            compareExpectedToState(expectedValue, state);
        });

        return self;
    };

    return self;
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

/**
 * Compare expected value to state
 */
const compareExpectedToState = (expectedValue, state) => {
    if (expectedValue === null || expectedValue === undefined) {
        assertShouldNotExist(state);
    } else {
        assertShouldExist(state);
        assertShouldDeepEqual(state, expectedValue);
    }
};

const mochaMocks = function (mockDescribe, mockIt) {
    this.describe = mockDescribe ? mockDescribe : describe;
    this.it = mockIt ? mockIt : it;
    return this;
};

const wrapInDescribe = function (shouldWrap) {
    this.shouldWrapInDescribe = shouldWrap;
    return this;
};

const withArgs = function () {
    this.args = [].slice.call(arguments);
    return this;
};