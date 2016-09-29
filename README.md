# redux-mocha-test-generators

Methods for testing redux actions, async actions, and reducers with mocha to avoid repetitive boilerplate.

## Installation
```
npm install redux-mocha-test-generators
```
## Usage

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