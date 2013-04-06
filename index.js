var inherits = require('inherits');
var events = require('events');

function isInBounds (touch, element) {
	var left   = element.offsetLeft
		, top    = element.offsetTop
		, right  = left + element.offsetWidth
		, bottom = top + element.offsetHeight
	;
	return (touch.pageX > left && touch.pageX < right && touch.pageY > top && touch.pageY < bottom);
}

function applyCss (element, key, value) {
	element.setProperty(key, value);
}

function UI (element) {
	this.element = element;

	this.spawnEvents();
}

inherits(UI, events.EventEmitter);

UI.prototype.spawnEvents = function () {
	this._tapStartTouch = { pageX: undefined, pageY: undefined };
	this.TAP_BOUND_X = 15;
	this.TAP_BOUND_Y = 15;
	var self = this;
	var element = self.element;

	// Adding built-in touch events

	element.addEventListener('touchstart', function (event) {
		self.emit('touchstart', event, element);
	}, false);
	element.addEventListener('touchmove', function (event) {
		self.emit('touchmove', event, element);
	}, false);
	element.addEventListener('touchend', function (event) {
		self.emit('touchend', event, element);
	}, false);
	element.addEventListener('touchcancel', function (event) {
		self.emit('touchcancel', event, element);
	}, false);

	// Custom touch events

	// Touch leave event
	var touchleaveHandler = function (event) {
		event.preventDefault();
		var touch = event.touches[0] || event.changedTouches[0];
		if (!isInBounds(touch, element)) {
			self.emit('touchleave', event, element);
			element.removeEventListener('touchmove', touchleaveHandler, false);
		}
	};

	element.addEventListener('touchmove', touchleaveHandler, false);
	element.addEventListener('touchend', function (event) {
		element.addEventListener('touchmove', touchleaveHandler, false);
	}, false);

	// Tap event
	element.addEventListener('touchstart', function (event) {
		self._tapStartTouch.pageX = event.changedTouches[0].pageX;
		self._tapStartTouch.pageY = event.changedTouches[0].pageY;
	}, false);

	var tapTouchLeaveHandler = function (event) {
		self._tapStartTouch.pageX = undefined;
		self._tapStartTouch.pageY = undefined;
	};
	self.on('touchleave', tapTouchLeaveHandler, false);
	element.addEventListener('touchcancel', tapTouchLeaveHandler, false);

	element.addEventListener('touchend', function (event) {
		if (!self._tapStartTouch.pageX && !self._tapStartTouch.pageY) return;

		var x = Math.abs(event.changedTouches[0].pageX - self._tapStartTouch.pageX);
		var y = Math.abs(event.changedTouches[0].pageY - self._tapStartTouch.pageY);

		if (x < self.TAP_BOUND_X && y < self.TAP_BOUND_Y) self.emit('tap', event, element);

		self._tapStartTouch.pageX = undefined;
		self._tapStartTouch.pageY = undefined;
	}, false);

	return self;
};

UI.prototype.css = function (key, value) {
	if ((typeof key) === 'string' && value) applyCss(this.element, key, value);
	else  if ((typeof key) === 'string')
		return element.style.getPropertyValue(key);
	else
		for (var k in key) applyCss(this.element, k, key[k]);

	return this;
};

module.exports = UI;