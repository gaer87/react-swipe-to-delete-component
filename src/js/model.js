export default class Model {
  constructor({deleteSwipe = .5}) {
    this.deleteSwipe = deleteSwipe;
    this.startX = 0;
    this.startY = 0;
    this.erasePrevX();
  }

  erasePrevX() {
    this.prevX = null;
  }

  calcSwipePercent({shift, width}) {
    return shift / width;
  }

  isDelete(percent) {
    return Math.abs(percent) >= this.deleteSwipe;
  }
}
