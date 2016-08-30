export const reducerNullInitial = (state = null, action) => {
    switch (action.type) {
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
