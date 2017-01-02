'use strict';

import isMobile from '../../src/js/utils/isMobile';

describe('The isMobule utils', function () {
	it('check mobile', function () {
		expect(isMobile.any()).toBeFalsy();
	});
});