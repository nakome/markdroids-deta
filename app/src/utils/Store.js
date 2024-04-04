/* The code defines a JavaScript object called `Store` with three properties and three methods. */
const Store = {
  _handlers: [],
  _flag: "",
  onChange(handler) {
    this._handlers.push(handler);
  },
  set(value) {
    this._flag = value;
    this._handlers.forEach((handler) => handler());
  },
  get() {
    return this._flag;
  },
};

export default Store;
