OrderedEventEmitter
===================

A minor extension to EventEmitter to allow ordering event listeners


```javascript
var OrderedEventEmitter = require('OrderedEventEmitter');

// Should match new EventEmitter() - no args accepted
var emitter = new OrderedEventEmitter();

var inherits = emitter instanceof EventEmitter; // True

// All the expected stuff hooks in to the parent.
emitter.on('something', function() { console.log('something happened'); });

// ... Except you can shove a listener to the head of the queue.
emitter.addListenerFirst('something', function() { console.log('something first!'); });
```
