export default class Model {
  constructor({deleteSwipe = .5}) {
    this.deleteSwipe = deleteSwipe;
    this.startX = 0;
    this.erasePrevX();
  }

  erasePrevX() {
    this.prevX = null;
  }

  hasPrevX() {
    return this.prevX !== null;
  }

  calcSwipePercent({shift, width}) {
    return shift / width;
  }

  isDelete(percent) {
    return ((percent > 0 && percent >= this.deleteSwipe) || (percent < 0 && percent <= -this.deleteSwipe));
  }
}
