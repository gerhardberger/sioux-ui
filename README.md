# Sioux UI

## Overview

The `UI` class is a basic class for the a sioux modules. It has things that is most likely needed on a touchscreen.

#### Inheriths from:
- events.EventEmitter

javascript:
``` js
var UI = require('sioux-ui');
var elem = new UI(document.querySelector('.foo'));

elem
.on('tap', function (event) {
  console.log('Tapped!');
})
.on('touchleave', function (event, state) {
  console.log('State: ' + state);
})
;
```

## Properties
#### element
- the DOM element that the isntance is bound to
- __required__

#### TAP_BOUND_X
- the x coordinate that determines how much can a finger move in a `'tap'` event (absolute value)
- __default:__ 15

#### TAP_BOUND_Y
- the y coordinate that determines how much can a finger move in a `'tap'` event (absolute value)
- __default:__ 15

## Methods
#### spawnEvents()
Spawns the touch events (custom too), so you can use the `.on` method with the instance.

#### css(key, value)
The common way to add style to the `element`. Supports passed in object too.

## Events
#### 'tap'
Simple tap event.

#### 'touchleave'
Fires when the finger leaves the element.