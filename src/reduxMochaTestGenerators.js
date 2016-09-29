/*global require, describe, it */

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
}

/**
 * Test that an async action creator calls the correct actions.  The async method should be mocked 
 * and should return a Promise.
 * @param {function} describe - mocha describe function
 * @param {function} it - mocha it describe function
 */
export const shouldDispatchCorrectActions = (describe, it, asyncActionCreator, expectedActions, success = true, shouldWrapInDescribe = true, message) => {
    if (!describe) {
        throw new Error('describe is required');
    }

    if (!it) {
        throw new Error('it is required');
    }

    if (!asyncActionCreator) {
        throw new Error('asyncActionCreator is required');
    }

    const self = {
        asyncActionCreator,
        expectedActions,
        success,
        it,
        describe,
        shouldWrapInDescribe,
        message
    };

    /**
     * Run the async actions test
     * Method for running set up code. Use for mocks.
     * @param {array} actionCreatorArgs - the args that will be passed into the asyncActionCreator
     * @param {function} fn - set up function
     */
    self.run = (asyncActionCreatorArgs, fn) => {

        const successText = self.success ? 'successful' : 'unsuccessful';
        const shouldMessage = self.message ? self.message : `should create the appropriate actions when async call ${successText}`;

        wrapInDescribeBlock(self.describe, self.it, self.shouldWrapInDescribe, self.asyncActionCreator.name, shouldMessage,
            () => {
                if (asyncActionCreatorArgs && typeof (asyncActionCreatorArgs) === 'function') {
                    fn = asyncActionCreatorArgs;
                }

                if (fn && typeof (fn) === 'function') {
                    fn();
                }

                const store = mockStore();
                return store.dispatch(self.asyncActionCreator.apply(this, asyncActionCreatorArgs))
                    .then(() => {
                        assertShouldDeepEqual(store.getActions(), self.expectedActions);

                    })
                    .catch(() => {
                        assertShouldDeepEqual(store.getActions(), self.expectedActions);

                    });
            });
    };

    return self;
};

/**
 * Test both the success and failure action for an async action creator.
 * @param {function} describe - mocha describe function
 * @param {function} it - mocha it describe function
 * @param {function} asyncActionCreator - the async action creator to test
 */
export const shouldDispatchSuccessAndFailureActions = (describe, it, asyncActionCreator) => {
    if (!describe) {
        throw new Error('describe is required');
    }

    if (!it) {
        throw new Error('it is required');
    }

    if (!asyncActionCreator) {
        throw new Error('asyncActionCreator is required');
    }

    const self = {
        describe,
        it,
        asyncActionCreator
    };

    /**
     * Run the async actions test for succes and failure
     * @param {Object} successConfig - success options
     * @param {Object[]} [successConfig.args] - the args that will be passed into the asyncActionCreator
     * @param {function} [successConfig.setUp] - set up function
     * @param {Object} failureConfig - failure options
     * @param {Object[]} [failureConfig.asyncActionCreatorArgs] - the args that will be passed into the asyncActionCreator
     * @param {function} [failureConfig.setUp] - set up function
     */
    self.run = (successConfig, failureConfig) => {
        const successArgs = successConfig.args ? successConfig.args : []; 
        shouldDispatchCorrectActions(self.describe, self.it, self.asyncActionCreator, successConfig.expectedActions, true, false)
            .run(successArgs, successConfig.setUp);

        const failureArgs = failureConfig.args ? failureConfig.args : []; 
        shouldDispatchCorrectActions(self.describe, self.it, self.asyncActionCreator, failureConfig.expectedActions, false, false)
            .run(failureArgs, failureConfig.setUp);

        
    };

    return self;
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

        compareExpectedToState(expectedInitialValue, state);

    });
};

/**
 * Test that the reducer handles the action correctly by returning the expectedValue
 * @param {function} it - mocha it describe function
 * @param {function} reducer - the reducer to test
 * @param {object} action - the action the reducer will handle
 * @param {object} expectedValue - the value to expect when the action to return
 * @param {object} initialValue - the value that the reducer should have initially
 */
export const shouldHandleAction = (it, reducer, action, expectedValue, initialValue = undefined, message = null) => {
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

    const itMessage = message ? message : `should handle ${action.type}`;

    wrapInItBlock(it, itMessage, () => {
        const state = reducer(initialValue, action);

        compareExpectedToState(expectedValue, state);
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