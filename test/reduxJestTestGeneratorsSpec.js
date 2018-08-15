/*global describe, jest, test, beforeEach, require, expect */


const mockAssertions = {
    assertShouldDeepEqual: jest.fn(),
    assertShouldExist: jest.fn(),
    assertShouldBeNull: jest.fn(),
    assertShouldBeUndefined: jest.fn()
};

jest.mock('../src/assertions', () => mockAssertions);

const {
    actionCreator,
    asyncActionCreator,
    reducer,
} = require('../src/reduxJestTestGenerators');

const fakeGlobal = {};

describe('reduxJestTestGenerators', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('actionCreator', () => {
        const getDefaultActionCreator = () => {
            const args = [
                'someValue'
            ];

            const someActionType = 'SOME_ACTION';
            const someAction = {
                type: someActionType,
                val: args[0]
            };
            return () => {
                return someAction;
            };
        };

        beforeEach(() => {
            fakeGlobal.describe = (message, fn) => {
                fn();
            };

            fakeGlobal.test = (message, fn) => {
                fn();
            };
        });

        test('should throw an error if no actionCreator is passed in', () => {
            expect(() => {
                actionCreator();
            }).toThrow('actionCreator is required');
        });

        test(
            'should return an object with the correct properties with initial values',
            () => {
                const someActionCreator = getDefaultActionCreator();
                const result = actionCreator(someActionCreator);

                expect(result).toHaveProperty('actionCreator');
                expect(result.actionCreator).toEqual(someActionCreator);

                expect(result).toHaveProperty('describe');
                expect(result.describe).toEqual(describe);

                expect(result).toHaveProperty('test');
                expect(result.test).toEqual(test);

                expect(result).toHaveProperty('shouldWrapInDescribe');
                expect(result.shouldWrapInDescribe).toBe(false);

                expect(result).toHaveProperty('args');
                expect(result.args).toEqual([]);
            }
        );

        test('should return an object with the correct methods', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = actionCreator(someActionCreator);

            expect(result).toHaveProperty('jestMocks');
            expect(result).toHaveProperty('wrapInDescribe');
            expect(result).toHaveProperty('withArgs');
            expect(result).toHaveProperty('shouldCreateAction');

        });

        test(
            'should mock the describe and test methods when jestMocks is called',
            () => {
                const someActionCreator = getDefaultActionCreator();
                const result = actionCreator(someActionCreator)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test);

                expect(result.describe).toEqual(fakeGlobal.describe);
                expect(result.test).toEqual(fakeGlobal.test);
            }
        );

        test(
            'should mock the describe and test methods when jestMocks is called',
            () => {
                const someActionCreator = getDefaultActionCreator();
                const result = actionCreator(someActionCreator)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test);

                expect(result.describe).toEqual(fakeGlobal.describe);
                expect(result.test).toEqual(fakeGlobal.test);
            }
        );

        test('should set shouldWrapInDescribe when wrapInDescribe is called', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = actionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .wrapInDescribe(true);

            expect(result.shouldWrapInDescribe).toBe(true);
        });

        test('should set args when withArgs is called', () => {
            const args = [1, 2];
            const someActionCreator = getDefaultActionCreator();
            const result = actionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .wrapInDescribe(true)
                .withArgs(1, 2);

            expect(result.args).toEqual(args);
        });

        test('should call \'describe\' if wrapInDescribe is called with true', () => {
            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };
            const someActionCreator = () => {
                return someAction;
            };
            const spy = jest.spyOn(fakeGlobal, 'describe');

            actionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .wrapInDescribe(true)
                .shouldCreateAction(someAction);

            expect(spy.mock.calls.length).toEqual(1);
            expect(spy.mock.calls[0][0]).toEqual('someActionCreator');
        });

        test(
            'should not call \'describe\' if wrapInDescribe is called with false',
            () => {
                const someActionType = 'SOME_ACTION';
                const someAction = { type: someActionType };
                const someActionCreator = () => {
                    return someAction;
                };
                const spy = jest.spyOn(fakeGlobal, 'describe');

                actionCreator(someActionCreator)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                    .wrapInDescribe(false)
                    .shouldCreateAction(someAction);

                expect(spy.mock.calls.length).toEqual(0);
            }
        );

        test('should not call \'describe\'', () => {
            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };
            const someActionCreator = () => {
                return someAction;
            };
            const spy = jest.spyOn(fakeGlobal, 'describe');

            actionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .shouldCreateAction(someAction);

            expect(spy.mock.calls.length).toEqual(0);
        });

        test('should call \'it\' with default message if none passed in', () => {
            const message = 'should create an action with type SOME_ACTION';

            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };
            const someActionCreator = () => {
                return someAction;
            };
            const spy = jest.spyOn(fakeGlobal, 'test');

            actionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .shouldCreateAction(someAction);

            expect(spy.mock.calls.length).toEqual(1);
            expect(spy.mock.calls[0][0]).toEqual(message);
        });

        test('should call \'it\' with passed in message', () => {
            const message = 'should definitely create an action with type SOME_ACTION';

            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };
            const someActionCreator = () => {
                return someAction;
            };
            const spy = jest.spyOn(fakeGlobal, 'test');

            actionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .shouldCreateAction(someAction, message);

            expect(spy.mock.calls.length).toEqual(1);
            expect(spy.mock.calls[0][0]).toEqual(message);
        });

        test(
            'should call assertShouldDeepEqual with the correct result and expected action with no arguments',
            () => {
                const message = 'should definitely create an action with type SOME_ACTION';

                const someActionType = 'SOME_ACTION';
                const someAction = { type: someActionType };
                const someActionCreator = () => {
                    return someAction;
                };

                const expectedAction = { type: someActionType };

                jest.spyOn(fakeGlobal, 'test');

                actionCreator(someActionCreator)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                    .shouldCreateAction(someAction, message);


                expect(mockAssertions.assertShouldDeepEqual.mock.calls.length).toBe(1);
                expect(mockAssertions.assertShouldDeepEqual.mock.calls[0][0]).toBe(someAction);
                expect(mockAssertions.assertShouldDeepEqual.mock.calls[0][1]).toEqual(expectedAction);
            }
        );

        test(
            'should call assertShouldDeepEqual with the correct result and expected action with arguments',
            () => {
                const message = 'should definitely create an action with type SOME_ACTION';

                const args = [1, 2];
                const someActionType = 'SOME_ACTION';
                const someAction = { type: someActionType };
                const someActionCreator = () => {
                    return someAction;
                };

                const expectedAction = { type: someActionType };

                jest.spyOn(fakeGlobal, 'test');

                actionCreator(someActionCreator)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                    .withArgs(args)
                    .shouldCreateAction(someAction, message);

                expect(mockAssertions.assertShouldDeepEqual.mock.calls.length).toBe(1);
                expect(mockAssertions.assertShouldDeepEqual.mock.calls[0][0]).toBe(someAction);
                expect(mockAssertions.assertShouldDeepEqual.mock.calls[0][1]).toEqual(expectedAction);
            }
        );

    });

    describe('asyncActionCreator', () => {
        const getDefaultActionCreator = () => {
            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            return () => {
                return () => {
                    return asyncMethod();
                };
            };
        };

        beforeEach(() => {
            fakeGlobal.describe = (message, fn) => {
                fn();
            };

            fakeGlobal.test = (message, fn) => {
                fn();
            };
        });

        test('should throw an error if no asyncActionCreator is passed in', () => {
            expect(() => {
                asyncActionCreator();
            }).toThrow('asyncActionCreator is required');
        });

        test(
            'should return an object with the correct properties with initial values',
            () => {
                const someActionCreator = getDefaultActionCreator();
                const result = asyncActionCreator(someActionCreator);

                expect(result).toHaveProperty('asyncActionCreator');
                expect(result.asyncActionCreator).toEqual(someActionCreator);

                expect(result).toHaveProperty('describe');
                expect(result.describe).toEqual(describe);

                expect(result).toHaveProperty('test');
                expect(result.test).toEqual(test);

                expect(result).toHaveProperty('shouldWrapInDescribe');
                expect(result.shouldWrapInDescribe).toBe(false);

                expect(result).toHaveProperty('args');
                expect(result.args).toEqual([]);
            }
        );

        test('should return an object with the correct methods', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator);

            expect(result).toHaveProperty('jestMocks');
            expect(result).toHaveProperty('wrapInDescribe');
            expect(result).toHaveProperty('withArgs');
            expect(result).toHaveProperty('shouldDispatchActions');

        });

        test(
            'should mock the describe and test methods when jestMocks is called',
            () => {
                const someActionCreator = getDefaultActionCreator();
                const result = asyncActionCreator(someActionCreator)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test);

                expect(result.describe).toEqual(fakeGlobal.describe);
                expect(result.test).toEqual(fakeGlobal.test);
            }
        );

        test(
            'should mock the describe and test methods when jestMocks is called',
            () => {
                const someActionCreator = getDefaultActionCreator();
                const result = asyncActionCreator(someActionCreator)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test);

                expect(result.describe).toEqual(fakeGlobal.describe);
                expect(result.test).toEqual(fakeGlobal.test);
            }
        );

        test('should set setUpFn when setUp is called', () => {
            const someFn = () => { };
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .setUp(someFn);

            expect(result.setUpFn).toEqual(someFn);
        });

        test('should set isSuccessful when success is called', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .success(false);

            expect(result.isSuccessful).toBe(false);
        });

        test('should set shouldWrapInDescribe when wrapInDescribe is called', () => {
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .wrapInDescribe(true);

            expect(result.shouldWrapInDescribe).toBe(true);
        });

        test('should set args when withArgs is called', () => {
            const args = [1, 2];
            const someActionCreator = getDefaultActionCreator();
            const result = asyncActionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .wrapInDescribe(true)
                .withArgs(1, 2);

            expect(result.args).toEqual(args);
        });

        test('should call \'describe\' if wrapInDescribe is called with true', () => {
            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return () => {
                    return asyncMethod();
                };
            };

            const spy = jest.spyOn(fakeGlobal, 'describe');

            asyncActionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .wrapInDescribe(true)
                .shouldDispatchActions([someAction]);

            expect(spy.mock.calls.length).toEqual(1);
            expect(spy.mock.calls[0][0]).toEqual('someActionCreator');
        });

        test(
            'should not call \'describe\' if wrapInDescribe is called with false',
            () => {
                const someActionType = 'SOME_ACTION';
                const someAction = { type: someActionType };

                const asyncMethod = () => {
                    return new Promise(resolve => resolve());
                };

                const someActionCreator = () => {
                    return () => {
                        return asyncMethod();
                    };
                };

                const spy = jest.spyOn(fakeGlobal, 'describe');

                asyncActionCreator(someActionCreator)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                    .wrapInDescribe(false)
                    .shouldDispatchActions([someAction]);

                expect(spy.mock.calls.length).toEqual(0);
            }
        );

        test('should not call \'describe\'', () => {
            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return () => {
                    return asyncMethod();
                };
            };

            const spy = jest.spyOn(fakeGlobal, 'describe');

            asyncActionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .shouldDispatchActions([someAction]);

            expect(spy.mock.calls.length).toEqual(0);
        });

        test('should call \'it\' with default message if none passed in', () => {
            const message = 'should create an action with type SOME_ACTION';

            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return () => {
                    return asyncMethod();
                };
            };

            const spy = jest.spyOn(fakeGlobal, 'test');

            asyncActionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .shouldDispatchActions([someAction], message);

            expect(spy.mock.calls.length).toEqual(1);
            expect(spy.mock.calls[0][0]).toEqual(message);
        });

        test('should call \'it\' with passed in message', () => {
            const message = 'should definitely create an action with type SOME_ACTION';

            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return () => {
                    return asyncMethod();
                };
            };

            const spy = jest.spyOn(fakeGlobal, 'test');

            asyncActionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .shouldDispatchActions([someAction], message);


            expect(spy.mock.calls.length).toEqual(1);
            expect(spy.mock.calls[0][0]).toEqual(message);
        });

        test('should call setUp function if set', () => {
            const message = 'should definitely create an action with type SOME_ACTION';

            const someActionType = 'SOME_ACTION';
            const someAction = { type: someActionType };

            const asyncMethod = () => {
                return new Promise(resolve => resolve());
            };

            const someActionCreator = () => {
                return () => {
                    return asyncMethod();
                };
            };

            const setUp = jest.fn();

            asyncActionCreator(someActionCreator)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .setUp(setUp)
                .shouldDispatchActions([someAction], message);

            expect(setUp.mock.calls.length).toEqual(1);
        });

        test(
            'should call assertShouldDeepEqual with the correct result and expected action with no arguments',
            () => {
                const message = 'should definitely create an action with type SOME_ACTION';

                const someActionType = 'SOME_ACTION';
                const someAction = { type: someActionType };

                const asyncMethod = () => {
                    return new Promise(resolve => resolve());
                };

                const someActionCreator = () => {
                    return () => {
                        return asyncMethod();
                    };
                };

                const expectedAction = { type: someActionType };

                jest.spyOn(fakeGlobal, 'test');

                asyncActionCreator(someActionCreator)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                    .shouldDispatchActions([someAction], message)
                    .then(() => {
                        expect(mockAssertions.assertShouldDeepEqual.mock.calls.length).toBe(1);
                        expect(mockAssertions.assertShouldDeepEqual.mock.calls[0][0]).toBe(someAction);
                        expect(mockAssertions.assertShouldDeepEqual.mock.calls[0][1]).toBe(expectedAction);
                    });
            }
        );

        test(
            'should call assertShouldDeepEqual with the correct result and expected action with arguments',
            () => {

                const message = 'should definitely create an action with type SOME_ACTION';

                const args = [1, 2];
                const someActionType = 'SOME_ACTION';
                const someAction = { type: someActionType };

                const asyncMethod = () => {
                    return new Promise(resolve => resolve());
                };

                const someActionCreator = () => {
                    return () => {
                        return asyncMethod();
                    };
                };

                const expectedAction = { type: someActionType };

                jest.spyOn(fakeGlobal, 'test');

                asyncActionCreator(someActionCreator)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                    .withArgs(args)
                    .shouldDispatchActions([someAction], message)
                    .then(() => {
                        expect(mockAssertions.assertShouldDeepEqual.mock.calls.length).toBe(1);
                        expect(mockAssertions.assertShouldDeepEqual.mock.calls[0][0]).toBe(someAction);
                        expect(mockAssertions.assertShouldDeepEqual.mock.calls[0][1]).toBe(expectedAction);
                    });


            }
        );
    });

    describe('reducer', () => {
        beforeEach(() => {
            fakeGlobal.describe = (message, fn) => {
                fn();
            };

            fakeGlobal.test = (message, fn) => {
                fn();
            };
        });

        test('should throw an error if no reducer is passed in', () => {
            expect(() => {
                reducer();
            }).toThrow('reducer is required');
        });

        test(
            'should return an object with the correct properties with initial values',
            () => {
                const testReducer = (state = null, action) => {
                    switch (action.type) {
                        default:
                            return state;
                    }
                };

                const result = reducer(testReducer);

                expect(result).toHaveProperty('reducer');
                expect(result.reducer).toEqual(testReducer);

                expect(result).toHaveProperty('test');
                expect(result.test).toEqual(test);
            }
        );

        test('should return an object with the correct methods', () => {
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                }
            };

            const result = reducer(testReducer);

            expect(result).toHaveProperty('jestMocks');
            expect(result).toHaveProperty('shouldReturnTheInitialState');
            expect(result).toHaveProperty('shouldHandleAction');

        });
    });
    describe('reducer.shouldReturnTheInitialState', () => {
        beforeEach(() => {
            fakeGlobal.test = (message, fn) => {
                fn();
            };
        });

        test('should call \'it\' with default message if none passed in', () => {
            const expectedValue = 123;
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                }
            };

            const message = 'should return the default state';

            const spy = jest.spyOn(fakeGlobal, 'test');

            reducer(testReducer)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .shouldReturnTheInitialState(expectedValue);

            expect(spy.mock.calls.length).toEqual(1);
            expect(spy.mock.calls[0][0]).toEqual(message);
        });

        test('should call \'it\' with passed in message', () => {
            const expectedValue = 123;
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                }
            };

            const message = 'should return the default state123';

            const spy = jest.spyOn(fakeGlobal, 'test');

            reducer(testReducer)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .shouldReturnTheInitialState(expectedValue, message);

            expect(spy.mock.calls.length).toEqual(1);
            expect(spy.mock.calls[0][0]).toEqual(message);
        });

        test(
            'should call assertShouldDeepEqual on reducer\'s initial state and expectedValue',
            () => {
                const expectedValue = 123;
                const initialState = 321;
                const testReducer = (state = initialState, action) => {
                    switch (action.type) {
                        default:
                            return state;
                    }
                };

                reducer(testReducer)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                    .shouldReturnTheInitialState(expectedValue);

                expect(mockAssertions.assertShouldDeepEqual.mock.calls.length).toBe(1);
                expect(mockAssertions.assertShouldDeepEqual.mock.calls[0][0]).toBe(initialState);
                expect(mockAssertions.assertShouldDeepEqual.mock.calls[0][1]).toBe(expectedValue);
            }
        );
    });
    describe('reducer.shouldHandleAction', () => {
        beforeEach(() => {
            fakeGlobal.test = (message, fn) => {
                fn();
            };
        });

        test('should throw an error if no action is passed in', () => {
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                }
            };

            expect(() => {
                reducer(testReducer)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                    .shouldHandleAction();
            }).toThrow('action is required');
        });

        test('should throw an error if no action doesn\'t have a type', () => {
            const action = 'SOME_ACTION';
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                }
            };

            expect(() => {
                reducer(testReducer)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                    .shouldHandleAction(action);
            }).toThrow('an action must have a type');
        });

        test('should call \'it\' with default message if none passed in', () => {
            const action = { type: 'SOME_ACTION' };
            const expectedValue = 123;
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                }
            };

            const message = `should handle ${action.type}`;

            const spy = jest.spyOn(fakeGlobal, 'test');

            reducer(testReducer)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .shouldHandleAction(action, expectedValue);

            expect(spy.mock.calls.length).toEqual(1);
            expect(spy.mock.calls[0][0]).toEqual(message);
        });
        test('should call \'it\' with passed in message', () => {
            const action = { type: 'SOME_ACTION' };
            const expectedValue = 123;
            const testReducer = (state = null, action) => {
                switch (action.type) {
                    default:
                        return state;
                }
            };

            const message = 'some message';

            const spy = jest.spyOn(fakeGlobal, 'test');

            reducer(testReducer)
                .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                .shouldHandleAction(action, expectedValue, undefined, message);

            expect(spy.mock.calls.length).toEqual(1);
            expect(spy.mock.calls[0][0]).toEqual(message);
        });

        test(
            'should call assertShouldDeepEqual on reducer\'s value when handling the passed in action and expectedValue',
            () => {
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
                    }
                };


                reducer(testReducer)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                    .shouldHandleAction(action, expectedValue);


                expect(mockAssertions.assertShouldDeepEqual.mock.calls.length).toBe(1);
                expect(mockAssertions.assertShouldDeepEqual.mock.calls[0][0]).toBe(newValue);
                expect(mockAssertions.assertShouldDeepEqual.mock.calls[0][1]).toBe(expectedValue);
            }
        );
        test(
            'should call assertShouldBeNull on reducer\'s value when handling the passed in action and expectedValue is null',
            () => {
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
                    }
                };

                reducer(testReducer)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                    .shouldHandleAction(action, expectedValue);

                expect(mockAssertions.assertShouldBeNull.mock.calls.length).toBe(1);
                expect(mockAssertions.assertShouldBeNull.mock.calls[0][0]).toBe(newValue);
            }
        );
        test(
            'should call assertShouldBeUndefined on reducer\'s value when handling the passed in action and expectedValue is undefined',
            () => {
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
                    }
                };

                reducer(testReducer)
                    .jestMocks(fakeGlobal.describe, fakeGlobal.test)
                    .shouldHandleAction(action, expectedValue);

                expect(mockAssertions.assertShouldBeUndefined.mock.calls.length).toBe(1);
                expect(mockAssertions.assertShouldBeUndefined.mock.calls[0][0]).toBe(newValue);
            }
        );

    });
});