# redux-mocha-test-generators

Methods for testing redux action creators, async action creators, and reducers with mocha to avoid repetitive boilerplate.

## Installation
```
npm install redux-mocha-test-generators
```
## Usage

### Table Of Contents
- [Testing Action Creators](#testing-action-creators)
- [Testing Async Action Creators](#testing-async-action-creators)
- [Testing Reducers](#testing-reducers)

### Testing action creators
Call the actionCreator method by passing the action creator you want to test and 
then chain the test methods to the result.

You can test that an actionCreator creates the correct action

```javascript
import {actionCreator} from 'redux-mocha-test-generators';
import {SOME_ACTION_NO_ARGS, someActionNoArgs, SOME_ACTION_WITH_ARGS, someActionWithArgs} from 'actions';

actionCreator(someActionNoArgs)
    .shouldCreateAction({type: SOME_ACTION_NO_ARGS});

// wrap the it assertion in a describe block using the name of the action creator
actionCreator(someActionNoArgs)
    .wrapInDescribe(true)
    .shouldCreateAction({type: SOME_ACTION_NO_ARGS});

// calling withArgs tells the method that the arguments list needs to be passed 
// to the action creator. In this case a call to someActionWithArgs(1, 2) should create the action in shouldCreateAction.
actionCreator(someActionWithArgs)
    .withArgs(1, 2)
    .shouldCreateAction({type: SOME_ACTION_WITH_ARGS, arg1: 1, arg2: 2});
```

### Testing async action creators
Call the asyncActionCreator method by passing the action creator you want to test and 
then chain the test methods to the result.

You can test the actions dispatched for both successful and unsuccessful async calls.

__NOTE: your async action creators must return a promise for this to work__

```javascript
import {asyncActionCreator} from 'redux-mocha-test-generators';
import {someAsyncActionCreator} from 'async-action-creators';
import {someMockFn} from 'mocks';

const actions = [
    {type: 'SOME_ACTION'}
];

// checks if dispatching someAsyncActionCreator dispatches actions with optional 
// custom message for assertion
asyncActionCreator(someAsyncActionCreator)
    .shouldDispatchActions(actions, "should blah blah blah");

// checks if dispatching someAsyncActionCreator(1, 2, 3) dispatches actions
asyncActionCreator(someAsyncActionCreator)
    .withArgs(1, 2, 3)
    .shouldDispatchActions(actions);

// checks if dispatching someAsyncActionCreator(1, 2, 3) dispatches actions when 
// the code in setUp has been executed previously. setUp is a good place to set up mocks.
asyncActionCreator(someAsyncActionCreator)
    .setUp(() => {
        const promise = new Promise(resolve => resolve());
        someMockFn.withArgs(1, 2, 3).returns(promise);
    })
    .withArgs(1, 2, 3)
    .shouldDispatchActions(actions);

const failureActions = [
    {type: 'SOME_ACTION_FAILED'}
];

// checks if dispatching someAsyncActionCreator(1, 2, 3) dispatches actions when the async method fails and  
// the code in setUp has been executed previously. setUp is a good place to set up mocks.
asyncActionCreator(someAsyncActionCreator)
    .success(false)
    .setUp(() => {
        const promise = new Promise((resolve, reject) => reject());
        someMockFn.withArgs(1, 2, 3).returns(promise);
    })
    .withArgs(1, 2, 3)
    .shouldDispatchActions(failureActions);

```

### Testing reducers
Call the reducer method by passing in the reducer you want to test and then 
chain the test methods to the result.

You can test that a reducer is returning the correct initial state
```javascript
import {reducer} from 'redux-mocha-test-generators';
import {someReducer} from 'reducers';

reducer(someReducer)
    .shouldReturnTheInitialState(1);

```

You can test that a reducer handles an action correctly by passing in the action, 
the expected value, an optional previous value, and an optional message.
```javascript
import {reducer} from 'redux-mocha-test-generators';
import {SOME_ACTION} from 'actions';
import {someReducer} from 'reducers';

// required parameters
reducer(someReducer)
    .shouldHandleAction({type: SOME_ACTION, val: 1}, 1);

// with a previous value (2)
reducer(someReducer)
    .shouldHandleAction({type: SOME_ACTION, val: 1}, 1, 2);

// with a previous value and the message for the mocha it assertion
reducer(someReducer)
    .shouldHandleAction({type: SOME_ACTION, val: 1}, 1, 2, 'should set the value to 1');

```
You can also chain together a shouldReturnTheInitialState and multiple shouldHandleAction 
methods.
```javascript
import {reducer} from 'redux-mocha-test-generators';
import {SOME_ACTION, ANOTHER_ACTION} from 'actions';
import {someReducer} from 'reducers';

// this would execute three tests
reducer(someReducer)
    .shouldReturnTheInitialState(1)
    .shouldHandleAction({type: SOME_ACTION, val: 1}, 1)
    .shouldHandleAction({type: ANOTHER_ACTION}, val: 3}, 3);
```

## Examples
The examples directory contains examples of all three types of tests using actual 
reducers, action creators, and async action creators.

## License
MIT