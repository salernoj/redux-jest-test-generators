'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testActionCreatorReturnsCorrectPayload = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _assertions = require('./assertions');

/**
 * Test that an action creator returns the correct payload
 * @param {function} describe - mocha describe function
 * @param {function} it - mocha it describe function
 * @param {function} actionCreator - the action creator to test
 * @param {string} actionType - the string type of the action
 * @param {array} actionCreatorArgs - the args that will be passed into the actionCreator
 * @param {object} payload - an object containing the non-type properties the actionCreator should returns
 * @param {string} message - the message for the assertion 
 */
var testActionCreatorReturnsCorrectPayload = exports.testActionCreatorReturnsCorrectPayload = function testActionCreatorReturnsCorrectPayload(describe, it, actionCreator, actionType, actionCreatorArgs, payload, message) {
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

    var shouldMessage = message ? message : 'should create an action with type ' + actionType;

    describe(actionCreator.name, function () {
        it(shouldMessage, function () {
            var expectedAction = _extends({
                type: actionType
            }, payload);

            var result = actionCreator.apply(undefined, actionCreatorArgs);

            (0, _assertions.assertShouldDeepEqual)(result, expectedAction);
        });
    });
};