var UI = require('../index.js');

var button = new UI(document.querySelector('button'));
console.log(button);

button.on('touchleave', function (event) {
	console.log('LEFT');
}).on('touchstart', function (event) {
	console.log('START');
}).on('tap', function (event) {
	console.log('TAP');
});