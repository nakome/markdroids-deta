/**
 * Checks if a value is undefined, if so, retrieves an item from local storage based on the key provided,
 * otherwise sets the value for the key in local storage.
 *
 * @param {string} key - The key to identify the item in local storage.
 * @param {string} value - The value to be stored in local storage.
 * @return {void} 
 */
let Storage = (key, value) => value === undefined
    ? window.localStorage.getItem(key) ? window.localStorage.getItem(key) : undefined
    : window.localStorage.setItem(key, value);

export default Storage;