import {
    testService
} from './services';

export const REQUEST = 'REQUEST';
export const request = () => {
    return { type: REQUEST }; 
};

export const RECEIVE = 'RECEIVE';
export const receive = result => { 
    return { type: RECEIVE, result }; 
};

export const RECEIVE_ERROR = 'RECEIVE_ERROR';
export const receiveError = error => { 
    return { type: RECEIVE_ERROR, error }; 
};

export const callService = () => {
    return dispatch => {
        dispatch(request());

        return new Promise((resolve, reject) => { 
            testService(true)
                .then(result => {
                    dispatch(receive(result));
                    resolve(result);
                })
                .catch(error => {
                    dispatch(receiveError(error));
                    reject(error);
                });
        });
    };
};