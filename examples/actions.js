export const SOME_ACTION_NO_ARGS = 'SOME_ACTION_NO_ARGS';
export const someActionNoArgs = () => {
    return {
        type: SOME_ACTION_NO_ARGS
    };
};

export const SOME_ACTION_WITH_ARGS = 'SOME_ACTION_WITH_ARGS';
export const someActionWithArgs = (arg1, arg2) => {
    return {
        type: SOME_ACTION_WITH_ARGS,
        arg1,
        arg2
    };
};