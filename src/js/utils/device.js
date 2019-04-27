export default class Device {
  static factory(isTouch) {
    return isTouch ? new Touch() : new Mouse();
  }
}

class Touch extends Device {
  getPageX(e) { return e.targetTouches[0].pageX; }

  getPageY(e) { return e.targetTouches[0].pageY; }

  getStartEventName() { return 'touchstart'; }

  getInteractEventName() { return 'touchmove'; }

  getStopEventNames() { return ['touchend']; }
}

class Mouse extends Device {
  getPageX(e) { return e.pageX; }

  getPageY(e) { return e.pageY; }

  getStartEventName() { return 'mousedown'; }

  getInteractEventName() { return 'mousemove'; }

  getStopEventNames() { return ['mouseup', 'mouseleave']; }
}
