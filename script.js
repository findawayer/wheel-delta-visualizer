(function ($) {
  var scrolled = false;
  var cache = initCache();

  function initCache() {
    var object = {};
    var events = [
      'wheel',
      'mousewheel',
      'DOMMouseScroll',
      'MozMousePixelScroll'
    ];
    var keys = [
      'delta',
      'deltaX',
      'deltaY',
      'detail',
      'wheelDelta',
      'wheelDeltaX',
      'wheelDeltaY'
    ];
    var i = 0;
    var j = 0;
    var type;
    var key;

    while (events[i]) {
      type = events[i];
      object[type] = {};

      while (keys[j]) {
        key = keys[j];
        object[type][key] = null;
        j += 1;
      }

      i += 1;
    }

    return object;
  }

  function addEvent(target, type, listener) {
    if (target.addEventListener) {
      target.addEventListener(type, listener);
    } else if (target.attachEvent) {
      target.attachEvent(type, listener);
    } else {
      throw new Error('Your browser does not support event listener binding.');
    }
  }

  function visualize() {
    document.getElementById('instructions').setAttribute('hidden', true);
    document.getElementById('visualizer').removeAttribute('hidden');
  }

  function diff(event) {
    var type = event.type;
    var delta = {
      delta: event.delta,
      deltaX: event.deltaX,
      deltaY: event.deltaY,
      detail: event.detail,
      wheelDelta: event.wheelDelta,
      wheelDeltaX: event.wheelDeltaX,
      wheelDeltaY: event.wheelDeltaY
    };
    var key;
    var keyLength = 7;
    for (key in delta) {
      if (delta.hasOwnProperty(key)) {
        if (delta[key] === cache[type][key]) {
          delete delta[key];
          keyLength -= 1;
        }
      }
    }
    return keyLength ? { type: type, delta: delta } : null;
  }

  function assign(data) {
    var type = data.type;
    var delta = data.delta;
    var key;
    for (key in delta) {
      if (delta.hasOwnProperty(key)) {
        cache[type][key] = delta[key];
      }
    }
  }

  function updateText(difference) {
    var type = difference.type;
    var delta = cache[type];
    var column = document.getElementById(type);
    var list = column.getElementsByTagName('ul')[0];
    var html = '';
    var key;
    var value;
    for (key in delta) {
      if (delta.hasOwnProperty(key)) {
        value = delta[key];
        html +=
          '<li><em>' + key + '</em><span>' + String(value) + '</span></li>';
      }
    }
    list.innerHTML = html;
  }

  function handleWheel(event) {
    if (!scrolled) {
      scrolled = true;
      visualize();
    }
    var difference = diff(event);
    if (difference) {
      assign(difference);
      updateText(difference);
    }
  }

  function init() {
    addEvent(document, 'wheel', handleWheel);
    addEvent(document, 'mousewheel', handleWheel);
    addEvent(document, 'DOMMouseScroll', handleWheel);
    addEvent(document, 'MozMousePixelScroll', handleWheel);
  }

  init();
})();
