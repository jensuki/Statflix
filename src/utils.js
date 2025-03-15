// util functions

// in order to prevent unnecessary requests
// debounce func() so its only executed after a 'delay' has passed after the last invocation

// goal: limit how often an input change request gets invoked
const debounce = (func, delay) => {
    // track timeoutId;
    let timeoutId;

    // pass all args to the function
    return (...args) => {
        // if theres an existing timeout, clear it to reset delay
        if (timeoutId) {
            clearTimeout(timeoutId);
        };

        // set a new timeout to invoke func() after specified delay
        timeoutId = setTimeout(() => {
            // execute func with original args
            func.apply(null, args)
        }, delay)
    }
}