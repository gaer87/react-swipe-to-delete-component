'use strict';

import State from '../src/js/model';

describe('The Model', function () {
	it('do an instance', function () {
		var state = new State({});
		expect(typeof state).toBe('object');
	});

	it('set "deleteSwipe" for initializing', function () {
		var state = new State({deleteSwipe: .7});
		expect(state.get('deleteSwipe')).toBe(.7);
	});

	it('validate "deleteSwipe"', function () {
		var state = new State({deleteSwipe: 'str'});
		expect(state.isValid()).toBe(false);

		state = new State({deleteSwipe: -.1});
		expect(state.isValid()).toBe(false);

		state = new State({deleteSwipe: 1.1});
		expect(state.isValid()).toBe(false);

		state = new State({deleteSwipe: .1});
		expect(state.isValid()).toBe(true);
	});

	it('calculate swipe', function () {
		var state = new State({});
		expect(state.calcSwipePercent({shift: 2, width: 4})).toBe(.5);
	});

	it('test to delete', function () {
		var state = new State({});
		expect(state.isDelete(.1)).toBe(false);
		expect(state.isDelete(-.1)).toBe(false);
		expect(state.isDelete(.7)).toBe(true);
		expect(state.isDelete(-.7)).toBe(true);
	});
});