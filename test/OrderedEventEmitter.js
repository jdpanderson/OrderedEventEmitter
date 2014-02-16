var should = require('should');
var EventEmitter = require('events').EventEmitter;
var jsc = require('jscoverage');
var OrderedEventEmitter = jsc.require(module, '../OrderedEventEmitter.js');

describe("Ordered Event Emitter", function() {
	it("Is an EventEmitter", function() {
		((new OrderedEventEmitter()) instanceof EventEmitter).should.be.true;
	});

	it("Adds listeners in a way that EventEmitter understands", function() {
		var emitter = new OrderedEventEmitter();
		emitter.listeners('test').length.should.be.exactly(0);
		emitter.addListenerFirst('test', function() {});
		emitter.listeners('test').length.should.be.exactly(1);
		emitter.addListenerFirst('test', function() {});
		emitter.listeners('test').length.should.be.exactly(2);
		emitter.addListenerFirst('test', function() {});
		emitter.listeners('test').length.should.be.exactly(3);
	});

	it("Allows injecting listeners first", function(done) {
		var values = [];
		var emitter = new OrderedEventEmitter();

		function checkDone() {
			if (values.length < 2) return;

			values[0].should.be.exactly('first');
			values[1].should.be.exactly('on');
			done();
		}

		emitter.on('test', function() { values.push("on"); checkDone(); });
		emitter.addListenerFirst('test', function() { values.push("first"); checkDone() });
		emitter.emit('test');
	});

	it("Blows up if you don't give it a function, just like EventEmitter", function() {
		var error;
		var emitter = new OrderedEventEmitter();
		emitter.on('test', function() {});
		try {
			emitter.addListenerFirst('test', undefined);
		} catch (e) {
			error = e;	
		}

		should(error instanceof TypeError).be.true;
	});

	it("Emits newListener events just like EventEmitter", function(done) {
		var emitter = new OrderedEventEmitter();
		var fn = function() {};
		emitter.on('test', function() {}); // Dummy to bypass call to EventEmitter.
		emitter.on('newListener', function(type, listener) {
			type.should.be.exactly('test');
			listener.should.be.exactly(fn);
			done();
		});

		emitter.addListenerFirst('test', fn);
	});
});

