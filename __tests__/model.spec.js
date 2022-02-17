import Model from '../src/js/model';

describe('A Model', () => {
  it('should calc swipe percents', () => {
    const model = new Model({deleteSwipe: .5});
    expect(model.calcSwipePercent({ shift: 2, width: 4 })).toBe(.5);
  });
});
