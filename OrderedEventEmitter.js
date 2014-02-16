var util = require('util');
var EventEmitter = require('events').EventEmitter;

function OrderedEventEmitter() {
  EventEmitter.call(this);
}
util.inherits(OrderedEventEmitter, EventEmitter);
OrderedEventEmitter.prototype.addListenerFirst = function(type, listener) {
  /* Use EventEmitter directly if possible: When there are no listeners */
  var listeners = this.listeners(type);
  if (!listeners.length) {
    this.addListener(type, listener);
    return this;
  }

  /* Here on out, we're mimicing EventEmitter behavior */
  if (typeof listener !== 'function') {
    throw TypeError('listener must be a function');
  }

  /* Do this for the same reason as EventEmitter: prevent recursion */
  if (this._events.newListener) {
    this.emit('newListener', type, listener);
  }

  /* EventEmitter can assign directly or to an array. Handle both. */
  if (typeof this._events[type] === 'object') {
    this._events[type].unshift(listener);
  } else {
    this._events[type] = [listener, this._events[type]];
  }

  return this;
};

module.exports = OrderedEventEmitter;