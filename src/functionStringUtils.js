/**
 * Get array of arguments from a function
 * @param {function} fn - function to get arguments from
 * @returns {array} -  array of arguments 
 */
export const getArgumentsFromFunction = fn => {
    if (typeof(fn) !== 'function') {
        throw new Error('fn must be a function');
    }

    const fnString = fn.toString();
    
    console.log(fnString);

    const openParenthesisPosition = fnString.indexOf('(');
    const closeParenthesisPosition = fnString.indexOf(')');

    console.log(openParenthesisPosition);
    console.log(closeParenthesisPosition);

    const argString = fnString.substr(openParenthesisPosition + 1, closeParenthesisPosition + openParenthesisPosition - 1);

    if (argString.length > 0) {
        return argString.replace(' ', '').split(',');
    }

    return [];
};