import {
    SOME_ACTION_NO_ARGS,
    SOME_ACTION_WITH_ARGS
} from './actions';

export const reducerNullInitial = (state = null, action) => {
    switch (action.type) {
        case SOME_ACTION_NO_ARGS:
            return 1;
        case SOME_ACTION_WITH_ARGS:
            return action.arg1;
        default:
            return state;
    }
};

export const reducerUndefinedInitial = (state = undefined, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export const reducerEmptyArrayInitial = (state = [], action) => {
    switch (action.type) {
        default:
            return state;
    }
};
