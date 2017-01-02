'use strict';

import DelView from '../src/js/delete';

describe('The DelView', function () {
	var delView = new DelView();

	it('do an instance', function () {
		expect(typeof delView).toBe('object');
	});

	it('render svg elements', function () {
		delView.render();
		expect(delView.$('svg').length).toBe(2);
	});
});